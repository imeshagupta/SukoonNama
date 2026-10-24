import { useState } from "react";
import styles from "../styles/About.module.css";
import imageUrl from "../styles/my-img.jpeg";
import cert1 from "../assets/img1.jpg";
import cert2 from "../assets/img2.jpg";
import cert3 from "../assets/img5.jpg";
import cert4 from "../assets/img4.jpg";

import cert5 from "../assets/img3.jpg";
import cert6 from "../assets/img10.jpg";
import cert7 from "../assets/img7.jpg";
import cert8 from "../assets/img15.jpg";

import cert9 from "../assets/img8.jpg";
import cert10 from "../assets/img9.jpg";
import cert11 from "../assets/img11.jpg";
import cert12 from "../assets/img12.jpg";

import cert13 from "../assets/img13.jpg";
import cert14 from "../assets/img14.jpg";
import cert15 from "../assets/img6.jpg";
import GalleryLightbox from "./GalleryLightbox";
import { Helmet } from "react-helmet-async";

const galleryImages = [
  cert1,
  cert2,
  cert3,
  cert4,
  cert5,
  cert6,
  cert7,
  cert8,
  cert9,
  cert10,
  cert11,
  cert12,
  cert13,
  cert14,
  cert15,
];

export default function About() {
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });

  const openLightbox = (index) => setLightbox({ open: true, index });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });
  const prev = () => setLightbox((prevState) => ({ ...prevState, index: (prevState.index - 1 + galleryImages.length) % galleryImages.length }));
  const next = () => setLightbox((prevState) => ({ ...prevState, index: (prevState.index + 1) % galleryImages.length }));

  return (
    <section className={styles.about}>
      <Helmet>
        <title>About | SukoonNama</title>
        <meta name="description" content="About SukoonNama and writer Esha Gupta - shayari, poetry and jazbaat." />
      </Helmet>
      <div className={styles.container}>
        <h2 className={styles.heading}>About</h2>

        <p className={styles.text}>
          <strong>SukoonNama</strong> एक ऐसी जगह है जहाँ शब्दों से जज़्बात बुनते
          हैं। यहाँ आपको मिलेंगी शायरियाँ, कविताएँ, और दिल से निकली हुई बातें —
          जो हर किसी के जज़्बातों को छू जाएँ।
        </p>

        <p className={styles.text}>
          यह मंच उन सभी के लिए है जो अपने दिल की आवाज़ को लफ़्ज़ों में ढालना
          चाहते हैं। हमारी कोशिश है कि हम भावनाओं को एक रूप दें जो लोगों के
          दिलों को छू जाए।
        </p>

        <p className={styles.signature}>~SukoonNama 🌸</p>

        <div className={styles.whySection}>
          <h3 className={styles.subheading}>Why SukoonNama?</h3>
          <p className={styles.text}>
            SukoonNama सिर्फ एक नाम नहीं, एक एहसास है। यह मंच शब्दों से सुकून
            देने का एक छोटा सा प्रयास है — जहाँ हर शायरी, हर कविता दिल के किसी
            कोने की आवाज़ बनकर सामने आती है। मेरा मकसद है कि जज़्बातों को लफ़्ज़ों
            में पिरोकर उन्हें ऐसे साझा करूँ कि पढ़ने वाले को भी वही सुकून मिले,
            जो लिखते वक़्त मुझे मिला था।
          </p>
        </div>

        <div className={styles.writerIntroCard}>
          <div
            className={styles.writerImage}
            style={{ backgroundImage: `url(${imageUrl})` }}
          ></div>
          <div className={styles.writerContent}>
            <h3 className={styles.writerName}>Meet the Writer</h3>
            <p className={styles.writerBio}>
              I, Esha Gupta, hail from Haldaur, Bijnor. I have a deep passion
              for poetry, along with a love for crafting and capturing the
              beauty of nature through photography. <br /> SukoonNama सिर्फ एक
              नाम नहीं, एक एहसास है — जो दिल से निकला और दिलों तक पहुँचा।
            </p>
          </div>
        </div>

        <div className={styles.achievements}>
          <h3 className={styles.subheading}>✨ Writer's Achievements</h3>
          <ul className={styles.achievementsList}>
            <li>
              🌸 Worked as a <strong>co-author in 50+ anthologies</strong>,
              contributing heartfelt poems and shayaris.
            </li>
            <li>
              🏆 Secured <strong>First Prize</strong> in an inter-college poetry
              competition during academic years.
            </li>
            <li>
              📜 Received <strong>certificates of appreciation</strong> from
              various literary platforms for outstanding contributions in
              poetry.
            </li>
          </ul>

          <div className={styles.gallery}>
            {galleryImages.map((img, index) => (
              <button
                key={index}
                className={styles.galleryItem}
                onClick={() => openLightbox(index)}
                aria-label={`View certificate ${index + 1}`}
              >
                <img
                  src={img}
                  alt={`Certificate ${index + 1}`}
                  className={styles.galleryImage}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.submitInvite}>
          <h3 className={styles.subheading}>📩 Want to Get Featured?</h3>
          <p className={styles.text}>
            If you’re a poetry lover and would like to showcase your work on
            SukoonNama, feel free to send your poem through the{" "}
            <a href="/contact" className={styles.link}>
              Contact Us
            </a>{" "}
            page or <strong>Social Media accounts</strong>. We would love to
            feature your jazbaat!
          </p>
          <p className={styles.text}>
            <strong>Published Anthologies:</strong> Co-author in 50+ anthologies across various literary platforms. 
          </p>
        </div>
      </div>
      {lightbox.open && (
        <GalleryLightbox
          images={galleryImages}
          index={lightbox.index}
          onClose={closeLightbox}
          onPrev={prev}
          onNext={next}
        />
      )}
    </section>
  );
}
