import { FileUpload } from "@/components/file-upload";

export default async function Home() {
  return (
      <main>
          <section className="my-3">
            <p>Supports every mode except Standard Relax</p>  
          </section>
          <FileUpload />
          <p className="mt-4 text-sm text-gray-400">Uploads expire after 3 days of being inactive</p>
      </main>
  );
}
