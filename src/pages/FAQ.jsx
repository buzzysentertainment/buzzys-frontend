import "./FAQ.css";

export default function FAQ() {
  return (
    <div className="faq-page">
      <h1 className="faq-title">Frequently Asked Questions</h1>

      <div className="faq-list">
        
        <div className="faq-item">
          <h3>How long are rentals for?</h3>
          <p>
            You keep your rental all day long-no rushed pickup windows. We typically arrive 30–90 minutes 
            before your party starts to set up. If you need more time, we offer flexible options, 
            including our <strong>Free Overnight Rental</strong> to ensure your event is a success!
          </p>
        </div>

        <div className="faq-item">
          <h3>What is the "Free Overnight" rental?</h3>
          <p>
            We offer a Free Overnight option so you can keep the fun going! Instead of the 6-hour block, 
            you keep the inflatable for the entire day and evening. Our team returns the following 
            morning (as early as <strong>7:00 AM</strong>) to retrieve it. 
            <em> Note: Please have the unit fully inflated for pickup so it can drain and be inspected.</em>
          </p>
        </div>

        <div className="faq-item">
          <h3>Do you require a deposit?</h3>
          <p>
            Yes — for residential rentals, we require a <strong>35% non‑refundable deposit</strong> at 
            the time of booking. The remaining balance is due 2 days before your event date.
          </p>
        </div>

        <div className="faq-item">
          <h3>What areas do you service?</h3>
          <p>
            We proudly serve <strong>Rome, GA</strong> and surrounding areas, including: 
            <strong> Silver Creek, Lindale, Cave Spring, Armuchee, Kingston, Cedartown, 
            and Summerville.</strong> If you’re located just outside these areas, reach out—we 
            frequently accommodate nearby locations for a small delivery fee!
          </p>
        </div>

        <div className="faq-item">
          <h3>What surfaces can inflatables be set up on?</h3>
          <p>
            We can set up on <strong>Grass (with stakes)</strong> or <strong>Concrete (with sandbags)</strong>. 
          </p>
        </div>

        <div className="faq-item">
          <h3>What happens if I need to cancel?</h3>
          <p>
            Cancellations within 10 days of your event incur a $50 fee. For events over $400, 
            cancellations within 30 days may incur additional charges. If <strong>inclement weather</strong> is 
            forecasted, you may cancel by 8 AM on the day of the event for a <strong>Rain Check</strong>.
          </p>
        </div>

        <div className="faq-item">
          <h3>What is the Damage Waiver?</h3>
          <p>
            For 8% of your rental fee, our waiver covers accidental damage during normal use. 
            It does <strong>not</strong> cover "Silly String," face paint, gum, or damage caused 
            by moving the unit from its setup location.
          </p>
        </div>

      </div>
    </div>
  );
}