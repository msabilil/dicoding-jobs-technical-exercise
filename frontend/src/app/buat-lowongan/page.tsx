"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, createVacancy, VacancyInput } from "@/lib/api";
import options from "@/lib/vacancy-options.json";

const positions = ["Engineering", "Product", "Design", "Data", "Quality Assurance", "Other"];
const locations = ["Bandung", "Jakarta", "Surabaya", "Yogyakarta", "Semarang", "Medan", "Lainnya"];
const types = options.employmentTypes;
const experiences = options.minimumExperiences;

export default function CreateVacancy() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const editor = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const mutation = useMutation({ mutationFn: createVacancy, onSuccess: vacancy => { queryClient.invalidateQueries({ queryKey: ["vacancies"] }); router.push(`/?created=${encodeURIComponent(vacancy.title)}`); }, onError: error => { if (error instanceof ApiError) setErrors(error.errors); } });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    const form = new FormData(event.currentTarget);
    const input: VacancyInput = {
      title: String(form.get("title") ?? ""), position: String(form.get("position") ?? ""),
      employment_type: String(form.get("employment_type") ?? ""), candidate_count: Number(form.get("candidate_count")),
      active_until: String(form.get("active_until") ?? ""), location: String(form.get("location") ?? ""),
      is_remote: form.has("is_remote"), description: editor.current?.innerHTML ?? "",
      salary_min: form.get("salary_min") ? Number(form.get("salary_min")) : null, salary_max: form.get("salary_max") ? Number(form.get("salary_max")) : null,
      show_salary: form.has("show_salary"), minimum_experience: String(form.get("minimum_experience") ?? ""),
    };
    mutation.mutate(input);
  }

  function fieldError(name: string) { return errors[name] && <small className="field-error" role="alert">{errors[name][0]}</small>; }

  return <><section className="hero create-hero"><div className="hero-inner"><h1>Buat lowongan pekerjaan <span className="hero-accent" aria-hidden="true" /></h1><p>Dicoding Jobs menghubungkan industri dengan talenta yang tepat.<br />Mencari tim baru tidak harus melelahkan dan boros biaya.</p></div></section>
    <main className="form-wrap"><form onSubmit={submit} noValidate>
      <label className="field">Judul lowongan <em>*</em><input name="title" placeholder="Masukkan judul lowongan" required />{fieldError("title")}<small>Contoh: Android Native Developer</small></label>
      <label className="field">Posisi <em>*</em><select name="position" required><option value="">Pilih posisi yang dicari</option>{positions.map(value => <option key={value}>{value}</option>)}</select>{fieldError("position")}</label>
      <fieldset className="field"><legend>Tipe pekerjaan <em>*</em></legend>{types.map(value => <label className="choice" key={value}><input type="radio" name="employment_type" value={value} /> {value}</label>)}{fieldError("employment_type")}</fieldset>
      <label className="field">Kandidat yang dibutuhkan <em>*</em><input name="candidate_count" type="number" min="1" placeholder="Masukkan jumlah kandidat yang dibutuhkan" required />{fieldError("candidate_count")}</label>
      <label className="field">Aktif hingga <em>*</em><input name="active_until" type="date" required />{fieldError("active_until")}</label>
      <div className="field"><label>Lokasi <em>*</em><select name="location" required><option value="">Pilih lokasi</option>{locations.map(value => <option key={value}>{value}</option>)}</select></label>{fieldError("location")}<label className="choice"><input type="checkbox" name="is_remote" /> Bisa remote</label></div>
      <div className="field"><label htmlFor="description">Deskripsi <em>*</em></label><div className="editor-toolbar" aria-label="Format deskripsi"><button type="button" onClick={() => document.execCommand("bold")} aria-label="Tebal"><b>B</b></button><button type="button" onClick={() => document.execCommand("italic")} aria-label="Miring"><i>I</i></button><button type="button" onClick={() => document.execCommand("insertUnorderedList")} aria-label="Daftar poin">• List</button></div><div id="description" className="editor" contentEditable suppressContentEditableWarning ref={editor} role="textbox" aria-multiline="true" aria-label="Deskripsi" /><small>Jelaskan deskripsi pekerjaan, tanggung jawab, dan persyaratan.</small>{fieldError("description")}</div>
      <div className="field"><label>Rentang gaji per bulan <em>*</em></label><div className="salary-row"><label><span>Rp</span><input name="salary_min" aria-label="Gaji minimum" type="number" min="0" placeholder="Minimum" required /></label><span>–</span><label><span>Rp</span><input name="salary_max" aria-label="Gaji maksimum" type="number" min="0" placeholder="Maksimum (opsional)" /></label></div>{fieldError("salary_min")}{fieldError("salary_max")}<small>Anda tidak perlu mengisi kolom &quot;Maksimum&quot; jika yang dimasukkan adalah gaji pokok.</small><label className="choice"><input type="checkbox" name="show_salary" /> Tampilkan gaji</label></div>
      <fieldset className="field"><legend>Minimum pengalaman bekerja <em>*</em></legend>{experiences.map(value => <label className="choice" key={value}><input type="radio" name="minimum_experience" value={value} /> {value}</label>)}{fieldError("minimum_experience")}</fieldset>
      {mutation.isError && Object.keys(errors).length === 0 && <p role="alert">Lowongan gagal disimpan. Coba lagi.</p>}
      <div className="form-actions"><button className="primary-button" type="submit" disabled={mutation.isPending}>{mutation.isPending ? "Menyimpan..." : "Buat lowongan"}</button><Link className="secondary-button" href="/">Batal</Link></div>
    </form></main></>;
}
