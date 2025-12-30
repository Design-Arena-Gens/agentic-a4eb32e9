"use client";

import { useMemo, useState } from "react";

type InputState = {
  businessName: string;
  niche: string;
  clientType: string;
  instagramHandle: string;
  currentNotes: string;
  goals: string;
};

type OutputBundle = {
  clientType: string;
  niche: string;
  currentCondition: string;
  problems: string[];
  needs: string[];
  designSuggestions: string[];
  dmScript: string;
  offerSuggestion: string;
  pricingSuggestion: string;
  cta: string;
};

const baseProblems = [
  "अनियमित पोस्टिंगमुळे ब्रँड रीकॉल कमी होत आहे",
  "व्हिज्युअल स्टाईलमध्ये एकसंधता नसल्यामुळे पोहोच कमी दिसते",
  "मूल्य प्रस्तावणा स्पष्ट न झाल्याने ग्राहकांमध्ये संभ्रम निर्माण होतो",
  "इंस्टाग्राम हायलाइट्समध्ये मुख्य सेवा / ऑफर्स ठळकपणे दिसत नाहीत",
];

const baseNeeds = [
  "व्यवस्थित ब्रँड गाईडलाइन्स आणि रंगसंगती",
  "एंगेजमेंट वाढवण्यासाठी कन्वर्जन-फ्रेंडली पोस्ट कॅलेंडर",
  "हायलाइट्स आणि स्टोरीजसाठी एकसंध व्हिज्युअल किट",
  "मार्केटिंग ऑफर्ससाठी उच्च गुणवत्तेचे टेम्पलेट्स",
];

const designIdeasByNiche: Record<string, string[]> = {
  cafe: [
    "कॉफी आणि स्नॅक्ससाठी सिग्नेचर 'Menu Reveal' कॅरोसेल",
    "रोजच्या विशेष ऑफरसाठी मॉडर्न मिनिमल पोस्ट टेम्पलेट",
    "कस्टमर रिव्ह्यूजसाठी ब्रँड-कलर नोट कार्ड डिझाईन",
  ],
  fitness: [
    "वर्कआउट प्रोग्राम्ससाठी बोल्ड टायपोग्राफी पोस्टर",
    "ट्रांसफॉर्मेशन स्टोरीजसाठी कॅरोसेल इंस्टाग्राम ब्रेकडाउन",
    "फिटनेस टीप्ससाठी हाई-कॉन्ट्रास्ट रील कव्हर्स",
  ],
  salon: [
    "पूर्व आणि नंतरच्या लुक्ससाठी उच्च दर्जाचे कॅरोसेल",
    "सीझनल ऑफर पोस्टर विथ गोल्ड एक्सेंट्स",
    "हायलाइट कव्हर सेट: सेवा, किंमत, बुकिंग",
  ],
  realestate: [
    "प्रॉपर्टी हायलाइट्ससाठी प्रीमियम स्लाइड डेक कॅरोसेल",
    "नवीन प्रोजेक्ट अनाऊन्समेंट साठी सिनेमॅटिक पोस्टर",
    "क्लाएंट टेस्टीमोनीअल्ससाठी ब्रँडेड कोट कार्ड",
  ],
  ecommerce: [
    "टॉप-सेलिंग प्रॉडक्टसाठी बोल्ड ऑफर पोस्टर",
    "सीझनल कॅम्पेनसाठी ब्रँडेड स्टोरी पॅक",
    "अपसेलला चालना देणारे बंडल-हाइलाइट कार्ड",
  ],
};

const defaultDesignIdeas = [
  "ब्रँड रंग व फॉन्टवर आधारित 'प्रोमो पोस्ट' टेम्पलेट सीरीज",
  "सेवा/प्रॉडक्ट स्पष्ट करणारे कथाकथन कॅरोसेल्स",
  "हायलाइट्ससाठी सातत्यपूर्ण आयकॉनोग्राफी सेट",
];

const offerIdeas = [
  "30-दिवसांचा इंस्टाग्राम ब्रँडिंग रिवॅम्प पॅकेज",
  "8 उच्च-इम्पॅक्ट पोस्ट्स + 4 स्टोरी टेम्पलेट्सचा लॉन्च किट",
  "त्यांच्या टीमसाठी 1-टू-1 कंटेंट स्टायलिंग सेशन समाविष्ट असलेला पॅकेज",
];

const pricingAnchors = [
  "₹8,500 — बेसिक इंस्टा रिवॅम्प पॅकेज (4 पोस्ट + 2 स्टोरी सेट्स)",
  "₹12,000 — ग्रोथ-फोकस्ड व्हिज्युअल कॅम्पेन (8 पोस्ट + 4 स्टोरी टेम्पलेट्स)",
  "₹18,000 — प्रीमियम फेसलिफ्ट (ब्रँड गाईड, 12 पोस्ट्स, 6 स्टोरी किट्स)",
];

const ctas = [
  "चला या आठवड्यात 15 मिनिटांची इंस्टा स्ट्रॅटेजी कॉल ठरवूया",
  "तुमच्या पुढच्या कॅम्पेनपूर्वी डिझाइन कॅलेंडर लॉक करूया",
  "आजच फ्री मॉक-अप मिळवा आणि निर्णय घ्या",
];

const cleanText = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

const resolveNicheIdeas = (niche: string) => {
  const key = cleanText(niche)
    .replace(/[^a-z]/g, " ")
    .split(" ")
    .filter(Boolean)
    .find((item) => Object.keys(designIdeasByNiche).includes(item));
  return key ? designIdeasByNiche[key] : defaultDesignIdeas;
};

const inferClientType = (value: string) => {
  if (!value.trim()) return "Local Business Owner";
  const formatted = cleanText(value);
  if (formatted.includes("agency")) return "Agency / Service Provider";
  if (formatted.includes("salon") || formatted.includes("spa"))
    return "Salon / Wellness Brand";
  if (formatted.includes("fitness") || formatted.includes("gym"))
    return "Fitness Coach / Gym";
  if (formatted.includes("cafe") || formatted.includes("restaurant"))
    return "Food & Beverage Brand";
  if (formatted.includes("real estate") || formatted.includes("realtor"))
    return "Real Estate Consultant";
  if (formatted.includes("startup")) return "Startup Founder";
  if (formatted.includes("ecommerce") || formatted.includes("store"))
    return "E-commerce Business";
  return "Local Business Owner";
};

const buildCurrentCondition = (state: InputState) => {
  const fragments = [];
  if (state.instagramHandle) {
    fragments.push(
      `इंस्टाग्रामवर @${state.instagramHandle.replace("@", "")} नावाने सक्रिय आहेत`
    );
  }
  if (state.currentNotes) {
    fragments.push(state.currentNotes.trim());
  } else {
    fragments.push("ऑनलाइन उपस्थिती नियमित असली तरी व्हिज्युअल सातत्य कमी दिसते");
  }
  if (state.goals) {
    fragments.push(`सध्याचा फोकस ${state.goals.trim()} यावर आहे`);
  }
  return fragments.join(" • ");
};

const craftDmScript = (state: InputState, output: OutputBundle) => {
  const business = state.businessName || state.instagramHandle || "तुमचा ब्रँड";
  const nicheLine = state.niche
    ? `${state.niche.trim()} क्षेत्रामध्ये`
    : "तुमच्या ब्रँडमध्ये";
  return [
    `नमस्कार ${business} टीम 👋`,
    `मी रिया, बिझनेस ग्राफिक डिझाईन आणि इंस्टाग्राम कन्वर्जन स्पेशॅलिस्ट. ${nicheLine} तुम्ही जे काम करत आहात ते खूप छान आहे.`,
    `तुमच्या पेजवर मला काही जबरदस्त स्ट्रेंग्थ दिसल्या, पण व्हिज्युअल स्ट्रॅटेजीला अजून थोडी पॉलिश देऊ शकलो तर लीड्स अधिक वेगाने कन्व्हर्ट होतील.`,
    `मी एक मिनी प्रपोजल तयार केले आहे ज्यात ${output.designSuggestions[0]} आणि ${output.offerSuggestion} समाविष्ट आहे.`,
    `जर आपण 15 मिनिटांचा क्विक कॉल ठरवू शकलो तर मी तुमच्यासाठी मागील महिन्यात कोचेससाठी मिळवलेले रिझल्ट्सही शेअर करू शकते.`,
    `आपल्याला आवडल्यास पहिल्या मॉक-अपवर कोणतेही बाइंडिंग नाही – फक्त आपण पाहूया आपण एकत्र काय करू शकतो.`,
    `तव्हरसोबत काम करण्यासाठी उत्सुक आहे!`,
  ].join("\n\n");
};

const buildOffer = (state: InputState) => {
  if (!state.goals) {
    return offerIdeas[0];
  }
  const goals = cleanText(state.goals);
  if (goals.includes("launch") || goals.includes("festive")) {
    return offerIdeas[1];
  }
  if (goals.includes("brand") || goals.includes("identity")) {
    return offerIdeas[2];
  }
  return offerIdeas[0];
};

const pickPricing = (state: InputState) => {
  const niche = cleanText(state.niche);
  if (niche.includes("premium") || niche.includes("real estate")) {
    return pricingAnchors[2];
  }
  if (niche.includes("startup") || niche.includes("launch")) {
    return pricingAnchors[1];
  }
  return pricingAnchors[0];
};

const pickCta = (state: InputState) => {
  const goals = cleanText(state.goals);
  if (goals.includes("campaign") || goals.includes("launch")) {
    return ctas[2];
  }
  if (goals.includes("calendar") || goals.includes("plan")) {
    return ctas[1];
  }
  return ctas[0];
};

const generateBundle = (state: InputState): OutputBundle => {
  const aggregatedProblems = [...baseProblems];
  if (state.currentNotes) {
    const text = cleanText(state.currentNotes);
    if (text.includes("low engagement")) {
      aggregatedProblems.unshift(
        "एंगेजमेंट लो असल्यामुळे कॉल-टू-अॅक्शन स्पष्ट दिसत नाही"
      );
    }
    if (text.includes("no logo") || text.includes("branding")) {
      aggregatedProblems.unshift(
        "ब्रँड ओळख दर्शवणारे लोगो/आयकॉन सातत्याने वापरले जात नाहीत"
      );
    }
    if (text.includes("content") || text.includes("ideas")) {
      aggregatedProblems.unshift(
        "कंटेंट पिलर्स स्पष्ट नसल्यामुळे पोस्टिंग डायरेक्शन गोंधळलेले वाटते"
      );
    }
  }
  const uniqueProblems = Array.from(new Set(aggregatedProblems)).slice(0, 4);
  const needs = Array.from(new Set(baseNeeds)).slice(0, 4);
  const design = resolveNicheIdeas(state.niche);
  const offer = buildOffer(state);
  const pricing = pickPricing(state);
  const cta = pickCta(state);

  const bundle: OutputBundle = {
    clientType: state.clientType || inferClientType(state.businessName),
    niche: state.niche.trim() || "Business Branding",
    currentCondition: buildCurrentCondition(state),
    problems: uniqueProblems,
    needs,
    designSuggestions: design,
    dmScript: "",
    offerSuggestion: offer,
    pricingSuggestion: pricing,
    cta,
  };

  bundle.dmScript = craftDmScript(state, bundle);
  return bundle;
};

const initialState: InputState = {
  businessName: "",
  niche: "",
  clientType: "",
  instagramHandle: "",
  currentNotes: "",
  goals: "",
};

export default function Home() {
  const [form, setForm] = useState<InputState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const output = useMemo(() => generateBundle(form), [form]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:gap-16 md:py-16">
        <section className="md:w-2/5">
          <header className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
              Agent Profile
            </span>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Insta Business Lead Conversion Agent
            </h1>
            <p className="text-sm text-slate-300 sm:text-base">
              प्रोफेशनल ग्राफिक डिझायनर + इंस्टाग्राम कन्वर्जन स्पेशॅलिस्ट.
              स्थानिक बिझनेस, स्टार्टअप्स, शॉप ओनर्स आणि सर्व्हिस प्रोव्हायडर्ससाठी
              रेडी-टू-क्लोज प्रस्ताव तयार करण्यासाठी आपल्या माहितीचा वापर करा.
            </p>
          </header>

          <form
            className="mt-8 flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg shadow-slate-900/30 backdrop-blur"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(true);
            }}
          >
            <h2 className="text-lg font-semibold text-white">
              Prospect माहिती भरा
            </h2>
            <label className="flex flex-col gap-2 text-sm text-slate-300">
              Business Name / Page
              <input
                className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                placeholder="उदा. Shree Fitness Hub"
                value={form.businessName}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    businessName: event.target.value,
                    clientType: inferClientType(event.target.value),
                  }))
                }
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-300">
              Client Type (ऑप्शनल)
              <input
                className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                placeholder="उदा. Local Business Owner"
                value={form.clientType}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, clientType: event.target.value }))
                }
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-300">
              Niche / Industry
              <input
                className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                placeholder="उदा. Fitness Studio, Cafe, Salon"
                value={form.niche}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, niche: event.target.value }))
                }
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-300">
              Instagram Handle (ऑप्शनल)
              <input
                className="rounded-lg border border-slate-800 bg-slate-950 px-4 py-2 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                placeholder="उदा. shreefitnesshub"
                value={form.instagramHandle}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    instagramHandle: event.target.value.replace("@", ""),
                  }))
                }
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-300">
              Observations / Current Problems
              <textarea
                className="min-h-[110px] rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                placeholder="उदा. Post engagement कमी, visuals random आहेत..."
                value={form.currentNotes}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, currentNotes: event.target.value }))
                }
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-300">
              Goals / Upcoming Campaigns
              <textarea
                className="min-h-[90px] rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40"
                placeholder="उदा. Diwali offer launch, service awareness वाढवायची आहे..."
                value={form.goals}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, goals: event.target.value }))
                }
              />
            </label>
            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            >
              Instant Analysis तयार करा
            </button>
          </form>
        </section>

        <section className="md:w-3/5">
          <div className="h-full rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl shadow-slate-900/40 backdrop-blur">
            <header className="flex flex-col gap-2 border-b border-slate-800 pb-4">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Conversion Blueprint
              </span>
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                Prospect Ready Output
              </h2>
              <p className="text-sm text-slate-400">
                कॉपी करा, एडिट करा आणि थेट डीएममध्ये वापरा. प्रत्येक विभाग लीड
                कन्वर्जनसाठी डिझाइन केलेला आहे.
              </p>
            </header>

            <article className="mt-6 space-y-6 text-sm leading-relaxed text-slate-100 sm:text-base">
              <div>
                <strong>Client Type:</strong> {output.clientType}
              </div>
              <div>
                <strong>Niche:</strong> {output.niche}
              </div>
              <div>
                <strong>Current Condition:</strong> {output.currentCondition}
              </div>
              <div>
                <strong>Problems:</strong>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  {output.problems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>What They Need:</strong>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  {output.needs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Design Suggestions:</strong>
                <ul className="mt-2 list-disc space-y-2 pl-5">
                  {output.designSuggestions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Perfect DM Script (Marathi):</strong>
                <pre className="mt-2 whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-200">
                  {output.dmScript}
                </pre>
              </div>
              <div>
                <strong>Offer Suggestion:</strong> {output.offerSuggestion}
              </div>
              <div>
                <strong>Pricing Suggestion:</strong> {output.pricingSuggestion}
              </div>
              <div>
                <strong>CTA:</strong> {output.cta}
              </div>
            </article>

            {!submitted && (
              <div className="mt-10 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-5 text-sm text-slate-300">
                फॉर्म भरल्यानंतर आउटपुट ऑटो-अपडेट होते. काहीही माहिती न भरल्यासही
                डिफॉल्ट कन्वर्जन ब्लूप्रिंट तयार राहील.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
