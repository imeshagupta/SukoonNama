import styles from "../styles/About.module.css";
const imageUrl = process.env.REACT_APP_PROFILE_IMAGE_URL;
export default function About() {
  return (
    <section className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.heading}>About</h2>

        <p className={styles.text}>
          <strong>SukoonNama</strong> एक ऐसी जगह है जहाँ शब्दों से जज़्बात बुनते
          हैं। यहाँ आपको मिलेंगी शायरियाँ, ग़ज़लें, और दिल से निकली हुई बातें —
          जो हर किसी के जज़्बातों को छू जाएँ।
        </p>

        <p className={styles.text}>
          यह मंच उन सभी के लिए है जो अपने दिल की आवाज़ को लफ़्ज़ों में ढालना
          चाहते हैं। हमारी कोशिश है कि हम भावनाओं को एक रूप दें जो लोगों के
          दिलों को छू जाए।
        </p>

        <p className={styles.signature}>~SukoonNama 🌸</p>

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
          </ul>
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
        </div>
      </div>
    </section>
  );
}
