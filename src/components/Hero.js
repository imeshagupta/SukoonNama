import styles from "../styles/Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>SukoonNama</h1>
        <p className={styles.subtitle}>दिल की बात, लफ़्ज़ों के साथ।</p>
        <p className={styles.description}>
          एक अहसास, एक सफ़र... शायरी और जज़्बातों की दुनिया में आपका स्वागत है।
        </p>
      </div>
    </section>
  );
}
