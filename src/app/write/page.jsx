export const dynamic = "force-dynamic";

import Image from "next/image";
import styles from "./writePage.module.css";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.bubble.css";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ReactQuill from "react-quill";

const WritePage = () => {
  const { status } = useSession();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState("");
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [catSlug, setCatSlug] = useState("");
  // Image Upload
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [router, status]);

  if (status === "loading") {
    return <div className={styles.loading}>Loading...</div>;
  }

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleFileChange = (e) => {
    console.log("handlefilechange");
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      console.log(image);
    }
  };
  const handleUpload = async (e) => {
    console.log("handlefileupload");
    e.preventDefault();
    if (!image) {
      console.log("No Image");
      return;
    }
    setUploading(false);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("Upload failed.");
      } else {
        setResult(data.result);
        console.log(data.result);
        alert("File Uploaded!");
      }
    } catch (error) {
      console.log("Something went wrong!!");
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = async () => {
    console.log("handleSubmit to submit data");
    console.log(result.secure_url);
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        desc: value,
        img: result.secure_url,
        slug: slugify(title),
        catSlug: catSlug || "style",
      }),
    });

    const data = await res.json().catch(() => null);
    console.log("Post response:", res.status, data);

    if (res.status === 200 && data?.slug) {
      router.push(`/posts/${data.slug}`);
    } else {
      alert("Failed to publish post. Check console for details.");
    }

    // File Upload
  };
  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Title"
        className={styles.input}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className={styles.select}
        onChange={(e) => setCatSlug(e.target.value)}
      >
        <option value="style">style</option>
        <option value="fashion">fashion</option>
        <option value="food">food</option>
        <option value="culture">culture</option>
        <option value="travel">travel</option>
        <option value="coding">coding</option>
      </select>

      <div className={styles.editor}>
        <button className={styles.button} onClick={() => setOpen(!open)}>
          <Image src="/plus.png" alt="" width={16} height={16} />
        </button>

        {open && (
          <form
            onSubmit={handleUpload}
            encType="multipart/form-data"
            className={styles.imageForm}
          >
            <label htmlFor="uploadInput" className={styles.uploadLabel}>
              Choose Image
            </label>
            <input
              id="uploadInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.hiddenInput}
            />

            <button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        )}

        <ReactQuill
          className={styles.textArea}
          theme="bubble"
          value={value}
          onChange={setValue}
          placeholder="Tell your story..."
        />
      </div>

      {media && (
        <div className={styles.previewImageWrapper}>
          <Image
            src={media}
            alt="Uploaded Image"
            width={200}
            height={120}
            className={styles.previewImage}
          />
        </div>
      )}

      <button className={styles.publish} onClick={handleSubmit}>
        Publish
      </button>
    </div>
  );
};

export default WritePage;
