"use client";

import { useState, FormEvent, ChangeEvent } from "react";

const IMPORTANT_AMENITIES = ["WiFi", "Air conditioning", "Free parking", "Washer", "Kitchen", "Heating", "Workspace", "TV"];

export default function ListingCheckup() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState("");
  const [price, setPrice] = useState("");
  const [nearbyPrice, setNearbyPrice] = useState("");
  const [checkedAmenities, setCheckedAmenities] = useState<string[]>([]);
  const [report, setReport] = useState<{ score: number; tips: any[] } | null>(null);

  const handleAmenity = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (e.target.checked) {
      setCheckedAmenities([...checkedAmenities, val]);
    } else {
      setCheckedAmenities(checkedAmenities.filter((a) => a !== val));
    }
  };

  const analyzeListing = (e: FormEvent) => {
    e.preventDefault();
    const tips = [];
    const numPhotos = Number(photos) || 0;
    const numPrice = Number(price) || 0;
    const numNearby = Number(nearbyPrice) || 0;

    // Photos check
    if (numPhotos === 0) {
      tips.push({ good: false, title: "No photo count entered", detail: "Add photos of every room — listings with more photos consistently get more bookings." });
    } else if (numPhotos < 5) {
      tips.push({ good: false, title: "Add more photos", detail: `You have ${numPhotos}. Aim for at least 10, covering every room and any outdoor space.` });
    } else if (numPhotos < 10) {
      tips.push({ good: false, title: "A few more photos would help", detail: `You have ${numPhotos}. Listings with 10+ photos tend to convert better.` });
    } else {
      tips.push({ good: true, title: "Photo count looks solid", detail: `${numPhotos} photos is a healthy amount for guests to get a full picture.` });
    }

    // Description check
    const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;
    if (wordCount < 40) {
      tips.push({ good: false, title: "Description is too short", detail: `You're at ${wordCount} words. Add more detail about the space, the neighborhood, and what makes it worth booking.` });
    } else {
      tips.push({ good: true, title: "Description length is good", detail: `${wordCount} words gives guests enough to go on.` });
    }

    const descLower = description.toLowerCase();
    if (!descLower.includes("check-in") && !descLower.includes("check in")) {
      tips.push({ good: false, title: "Mention check-in details", detail: "Guests want to know check-in time and process before booking — add a line about it." });
    }
    if (!descLower.includes("neighborhood") && !descLower.includes("area") && !descLower.includes("walk")) {
      tips.push({ good: false, title: "Mention the neighborhood", detail: "Say a bit about what's nearby (restaurants, transit, walkability) — it helps guests picture staying there." });
    }

    // Title check
    if (title.length < 20) {
      tips.push({ good: false, title: "Title could say more", detail: "A short title like this is easy to miss. Mention a standout feature — location, view, or amenity." });
    } else {
      tips.push({ good: true, title: "Title gives a good first impression", detail: "It's detailed enough to stand out in search results." });
    }

    // Price check
    if (numPrice > 0 && numNearby > 0) {
      const diff = (numPrice - numNearby) / numNearby;
      if (diff > 0.15) {
        tips.push({ good: false, title: "Your price is notably higher than nearby listings", detail: `You're at $${numPrice} vs. an area average of $${numNearby}. Make sure your listing clearly justifies the gap, or consider lowering it.` });
      } else if (diff < -0.15) {
        tips.push({ good: false, title: "You might be underpricing", detail: `At $${numPrice} vs. an area average of $${numNearby}, you could likely raise your price without losing bookings.` });
      } else {
        tips.push({ good: true, title: "Price is in line with the area", detail: `$${numPrice} is close to the area average of $${numNearby}.` });
      }
    }

    // Amenities check
    const importantMissing = IMPORTANT_AMENITIES.slice(0, 6).filter(a => !checkedAmenities.includes(a));
    if (importantMissing.length > 0) {
      tips.push({ good: false, title: "Missing common amenities", detail: `Guests often filter by: ${importantMissing.join(", ")}. Add these if you actually offer them, or consider adding them.` });
    } else {
      tips.push({ good: true, title: "You cover the common amenities", detail: "All the amenities guests usually filter by are checked." });
    }

    const goodCount = tips.filter(t => t.good).length;
    const scoreOutOf10 = Math.round((goodCount / tips.length) * 10);

    setReport({ score: scoreOutOf10, tips });
  };

  return (
    <>
      <header>
        <h1>Listing Checkup</h1>
        <p>Fill in your listing details below and get a plain-language report on what to fix to attract more bookings.</p>
      </header>

      <main>
        <div className="panel">
          <form onSubmit={analyzeListing}>
            <fieldset>
              <legend>The basics</legend>
              <div className="field">
                <label htmlFor="title">Listing title</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Cozy 2BR near downtown with parking" />
              </div>
              <div className="field">
                <label htmlFor="description">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your place, the neighborhood, check-in details, and anything guests should know..."></textarea>
                <div className="hint">Aim for at least 40 words. Mention check-in time and the neighborhood if you can.</div>
              </div>
              <div className="field">
                <label htmlFor="photos">Number of photos</label>
                <input type="number" id="photos" value={photos} onChange={(e) => setPhotos(e.target.value)} min="0" placeholder="e.g. 8" />
              </div>
            </fieldset>

            <fieldset>
              <legend>Pricing</legend>
              <div className="two-col">
                <div className="field">
                  <label htmlFor="price">Your nightly price ($)</label>
                  <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} min="0" placeholder="e.g. 120" />
                </div>
                <div className="field">
                  <label htmlFor="nearby-price">Avg. price nearby ($)</label>
                  <input type="number" id="nearby-price" value={nearbyPrice} onChange={(e) => setNearbyPrice(e.target.value)} min="0" placeholder="e.g. 110" />
                </div>
              </div>
              <div className="hint">Not sure on the nearby number? Check 3-4 similar listings in your area and average them.</div>
            </fieldset>

            <fieldset>
              <legend>Amenities you offer</legend>
              <div className="amenity-grid">
                {IMPORTANT_AMENITIES.map((amenity) => (
                  <label key={amenity}>
                    <input type="checkbox" value={amenity} onChange={handleAmenity} /> {amenity}
                  </label>
                ))}
              </div>
            </fieldset>

            <button type="submit">Check my listing</button>
          </form>
        </div>

        <div className="panel" id="results-panel">
          {!report ? (
            <div className="placeholder">
              <span>Your report will show up here once you check your listing.</span>
              <span>It'll cover your photos, price, description, and amenities — with plain tips on what to fix first.</span>
            </div>
          ) : (
            <div>
              <div className="score-row">
                <div className="score-circle">{report.score}/10</div>
                <div>
                  <div className="score-label">Your listing score</div>
                  <div className="score-title">{report.score >= 8 ? "Looking strong" : report.score >= 5 ? "Room to improve" : "Needs some work"}</div>
                </div>
              </div>
              {report.tips.map((t, idx) => (
                <div key={idx} className={`tip ${t.good ? 'good' : 'warn'}`}>
                  <div className="tip-icon">{t.good ? '✓' : '!'}</div>
                  <div className="tip-text">
                    <strong>{t.title}</strong>
                    <span>{t.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}