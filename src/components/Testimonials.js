import styles from "../styles/Testimonials.module.css";

const testimonials = [
  {
    name: "Aarav Mehta",
    feedback:
      "SukoonNama ने मेरी ज़िन्दगी के उन पहलुओं को शब्द दिए, जिन्हें मैं कभी बयां नहीं कर पाया था।",
  },
  {
    name: "Sonam Wadhwa",
    feedback:
      "हर शेर, हर ग़ज़ल दिल के बहुत करीब लगती है। जैसे किसी ने मेरी ही भावनाओं को लिख दिया हो।",
  },
  {
    name: "Ravi Kapoor",
    feedback:
      "ये सिर्फ एक वेबसाइट नहीं, ये एहसासों का समंदर है। हर बार कुछ नया महसूस होता है।",
  },
];

export default function Testimonials() {
  return (
    <section className={styles.testimonials}>
      <h2 className={styles.heading}>पाठकों की राय</h2>
      <div className={styles.grid}>
        {testimonials.map((item, index) => (
          <div key={index} className={styles.card}>
            <p className={styles.feedback}>"{item.feedback}"</p>
            <p className={styles.name}>- {item.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
