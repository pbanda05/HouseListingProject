const fs = require('fs');

const content = `"use client";
import { useState } from "react";
import Link from "next/link";

export default function CheckupPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    photoCount: 5,
    price: 150,
    marketPrice: 160,
    amenities: {
      wifi: true,
      ac: true,
      parking: false,
      kitchen: true,
      washer: false,
    },
  });

  const [results, setResults] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleChange = (e: React.ChangeEvent) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [amenity]: !formData.amenities[amenity as keyof typeof formData.amenities],
      },
    });
  };

  const runAudit = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 10;
    const tips: string[] = [];

    if (Number(formData.photoCount) < 15) {
      score -= 2;
      tips.push("📸 Low Photo Count: Top-performing listings typically have at least 15–20 high-quality photos covering all rooms, exterior, and unique angles.");
    }

    if (formData.title.length < 20) {
      score -= 2;
      tips.push("✍️ Title Too Short: Make your title punchy and descriptive (e.g., mention unique perks like 'Modern Downtown Loft w/ Free Parking').");
    }

    if (formData.description.length < 150) {
      score -= 2;
      tips.push("📄 Short Description: Flesh out your description. Mention local attractions, workspace setups, and sleeping arrangements.");
    }

    const diff = Number(formData.price) - Number(formData.marketPrice);
    if (diff > 30) {
      score -= 2;
      tips.push(\`💰 Price High vs Market: Your price (\(\${formData.price}) is significantly higher than nearby averages (\)\${formData.marketPrice}). Ensure your perks justify the premium.\`);
    } else if (diff < -30) {
      tips.push("💡 Pricing Opportunity: You are priced well below market average. You could likely increase your nightly rate without losing bookings.");
    }

    const missing = Object.entries(formData.amenities)
      .filter(([_, present]) => !present)
      .map(([name]) => name.toUpperCase());

    if (missing.length > 0) {
      score -= 1;
      tips.push(\`🛠️ Missing Key Amenities: Consider adding missing essentials like \${missing.join(", ")} to capture more searches.\`);
    }

    if (score < 1) score = 1;

    setResults({ score, tips });
    setEmailSent(false);
  };

  const sendReportEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setSendingEmail(true);

    setTimeout(() => {
      setSendingEmail(false);
      setEmailSent(true);
    }, 800);
  };

  return (
