"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type EditorJS from "@editorjs/editorjs";
import { ApiError, createVacancy, updateVacancy, Vacancy, VacancyInput } from "@/lib/api";
import { editorDataToHtml } from "@/lib/editorjs-html";
import options from "@/lib/vacancy-options.json";

const positions = ["Engineering", "Product", "Design", "Data", "Quality Assurance", "Other"];
const locations = ["Bandung", "Jakarta", "Surabaya", "Yogyakarta", "Semarang", "Medan", "Lainnya"];
const types = options.employmentTypes;
const experiences = options.minimumExperiences;

export function VacancyForm({ initial }: { initial?: Vacancy }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const editorHolder = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorJS | null>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [editorFailed, setEditorFailed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const mutation = useMutation({ mutationFn: (input: VacancyInput) => initial ? updateVacancy(initial.id, input) : createVacancy(input), onSuccess: vacancy => { queryClient.invalidateQueries({ queryKey: ["vacancies"] }); queryClient.invalidateQueries({ queryKey: ["dashboard-vacancies"] }); queryClient.invalidateQueries({ queryKey: ["vacancy", String(vacancy.id)] }); router.push(initial ? "/dashboard" : `/?created=${encodeURIComponent(vacancy.title)}`); }, onError: error => { if (error instanceof ApiError) setErrors(error.errors); } });

  useEffect(() => {
    let mounted = true;
    let instance: EditorJS | null = null;
    async function start() {
      try {
        const [{ default: Editor }, { default: Header }, { default: List }] = await Promise.all([
          import("@editorjs/editorjs"), import("@editorjs/header"), import("@editorjs/list"),
        ]);
        if (!mounted || !editorHolder.current) return;
        instance = new Editor({
          holder: editorHolder.current,
          placeholder: "Tulis deskripsi pekerjaan...",
          minHeight: 180,
          inlineToolbar: ["bold", "italic"],
          tools: {
            header: { class: Header, inlineToolbar: ["bold", "italic"], config: { levels: [2, 3], defaultLevel: 2 } },
            list: { class: List, inlineToolbar: ["bold", "italic"], config: { maxLevel: 3 } },
          },
        });
        editor.current = instance;
        await instance.isReady;
        if (!mounted) return;
        if (initial?.description) await instance.blocks.renderFromHTML(initial.description);
        if (mounted) setEditorReady(true);
      } catch {
        if (mounted) setEditorFailed(true);
      }
    }
    void start();
    return () => {
      mounted = false;
      if (instance) {
        const previous = instance;
        void previous.isReady.then(() => previous.destroy()).catch(() => {});
        if (editor.current === previous) editor.current = null;
      }
    };
  }, [initial?.description]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor.current || !editorReady) return;
    setErrors({});
    const form = new FormData(event.currentTarget);
    let description: string;
    try {
      description = editorDataToHtml(await editor.current.save());
    } catch {
      setEditorFailed(true);
      return;
    }
    const input: VacancyInput = {
      title: String(form.get("title") ?? ""), position: String(form.get("position") ?? ""),
      employment_type: String(form.get("employment_type") ?? ""), candidate_count: Number(form.get("candidate_count")),
      active_until: String(form.get("active_until") ?? ""), location: String(form.get("location") ?? ""),
      is_remote: form.has("is_remote"), description,
      salary_min: form.get("salary_min") ? Number(form.get("salary_min")) : null, salary_max: form.get("salary_max") ? Number(form.get("salary_max")) : null,
      show_salary: form.has("show_salary"), minimum_experience: String(form.get("minimum_experience") ?? ""),
    };
    mutation.mutate(input);
  }

  function fieldError(name: string) { return errors[name] && <small className="field-error" role="alert">{errors[name][0]}</small>; }

  return <><section className="hero create-hero"><div className="hero-inner"><h1>{initial ? "Edit lowongan pekerjaan" : "Buat lowongan pekerjaan"} <span className="hero-accent" aria-hidden="true" /></h1><p>Dicoding Jobs menghubungkan industri dengan talenta yang tepat.<br />Mencari tim baru tidak harus melelahkan dan boros biaya.</p></div></section>
    <main className="form-wrap"><form onSubmit={submit} noValidate>
      <label className="field">Judul lowongan <em>*</em><input name="title" placeholder="Masukkan judul lowongan" defaultValue={initial?.title} required />{fieldError("title")}<small>Contoh: Android Native Developer</small></label>
      <label className="field">Posisi <em>*</em><select name="position" defaultValue={initial?.position ?? ""} required><option value="">Pilih posisi yang dicari</option>{positions.map(value => <option key={value}>{value}</option>)}</select>{fieldError("position")}</label>
      <fieldset className="field"><legend>Tipe pekerjaan <em>*</em></legend>{types.map(value => <label className="choice" key={value}><input type="radio" name="employment_type" value={value} defaultChecked={initial?.employment_type === value} /> {value}</label>)}{fieldError("employment_type")}</fieldset>
      <label className="field">Kandidat yang dibutuhkan <em>*</em><input name="candidate_count" type="number" min="1" placeholder="Masukkan jumlah kandidat yang dibutuhkan" defaultValue={initial?.candidate_count} required />{fieldError("candidate_count")}</label>
      <label className="field">Aktif hingga <em>*</em><input name="active_until" type="date" defaultValue={initial?.active_until?.slice(0, 10)} required />{fieldError("active_until")}</label>
      <div className="field"><label>Lokasi <em>*</em><select name="location" defaultValue={initial?.location ?? ""} required><option value="">Pilih lokasi</option>{locations.map(value => <option key={value}>{value}</option>)}</select></label>{fieldError("location")}<label className="choice"><input type="checkbox" name="is_remote" defaultChecked={initial?.is_remote} /> Bisa remote</label></div>
      <div className="field"><label>Deskripsi <em>*</em></label><div className="editorjs" ref={editorHolder} aria-label="Deskripsi" />{!editorReady && !editorFailed && <small role="status">Menyiapkan editor...</small>}{editorFailed && <small className="field-error" role="alert">Editor gagal memuat atau menyimpan konten. Muat ulang halaman.</small>}<small>Gunakan tombol + untuk menambah judul atau daftar; pilih teks untuk format tebal dan miring.</small>{fieldError("description")}</div>
      <div className="field"><label>Rentang gaji per bulan <em>*</em></label><div className="salary-row"><label><span>Rp</span><input name="salary_min" aria-label="Gaji minimum" type="number" min="0" placeholder="Minimum" defaultValue={initial?.salary_min} required /></label><span>–</span><label><span>Rp</span><input name="salary_max" aria-label="Gaji maksimum" type="number" min="0" placeholder="Maksimum (opsional)" defaultValue={initial?.salary_max ?? undefined} /></label></div>{fieldError("salary_min")}{fieldError("salary_max")}<small>Anda tidak perlu mengisi kolom &quot;Maksimum&quot; jika yang dimasukkan adalah gaji pokok.</small><label className="choice"><input type="checkbox" name="show_salary" defaultChecked={initial?.show_salary} /> Tampilkan gaji</label></div>
      <fieldset className="field"><legend>Minimum pengalaman bekerja <em>*</em></legend>{experiences.map(value => <label className="choice" key={value}><input type="radio" name="minimum_experience" value={value} defaultChecked={initial?.minimum_experience === value} /> {value}</label>)}{fieldError("minimum_experience")}</fieldset>
      {mutation.isError && Object.keys(errors).length === 0 && <p role="alert">Lowongan gagal disimpan. Coba lagi.</p>}
      <div className="form-actions"><button className="primary-button" type="submit" disabled={mutation.isPending || !editorReady || editorFailed}>{mutation.isPending ? "Menyimpan..." : initial ? "Simpan perubahan" : "Buat lowongan"}</button><Link className="secondary-button" href={initial ? "/dashboard" : "/"}>Batal</Link></div>
    </form></main></>;
}
