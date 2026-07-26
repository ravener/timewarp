import { FileUpload } from "@/components/file-upload";

export default async function Home() {
  return (
      <main>
          <section className="my-3">
            <p>Supports every mode except Standard Relax</p>  
          </section>
          <FileUpload />
      </main>
  );
}
