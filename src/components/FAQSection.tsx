import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "SOHUB Protect কি?",
    answer:
      "SOHUB Protect হলো একটি স্মার্ট হোম সিকিউরিটি সিস্টেম যা আপনার বাড়ি, অফিস বা ব্যবসা প্রতিষ্ঠানকে সার্বক্ষণিক নিরাপত্তা প্রদান করে। মোবাইল অ্যাপের মাধ্যমে যেকোনো জায়গা থেকে আপনি আপনার সম্পদের উপর নজর রাখতে পারবেন।",
  },
  {
    question: "ইনস্টলেশন কি জটিল?",
    answer:
      "মোটেও না! আমাদের দক্ষ টেকনিশিয়ান টিম আপনার বাড়িতে এসে সম্পূর্ণ ইনস্টলেশন করে দেবে। সাধারণত ২-৩ ঘণ্টার মধ্যে পুরো সিস্টেম চালু হয়ে যায়।",
  },
  {
    question: "মাসিক কোনো চার্জ আছে কি?",
    answer:
      "ক্লাউড স্টোরেজ এবং রিমোট মনিটরিং সুবিধার জন্য একটি সাশ্রয়ী মাসিক সাবস্ক্রিপশন রয়েছে। তবে বেসিক ফিচারগুলো বিনামূল্যে ব্যবহার করা যায়।",
  },
  {
    question: "কোন কোন ডিভাইসের সাথে কাজ করে?",
    answer:
      "SOHUB Protect সিস্টেম Android এবং iOS উভয় প্ল্যাটফর্মে কাজ করে। এছাড়া Amazon Alexa এবং Google Home এর সাথেও সামঞ্জস্যপূর্ণ।",
  },
  {
    question: "ওয়ারেন্টি ও সাপোর্ট কেমন?",
    answer:
      "সকল ডিভাইসে ১ বছরের ওয়ারেন্টি রয়েছে। এছাড়া আমাদের ২৪/৭ কাস্টমার সাপোর্ট টিম সবসময় আপনার সেবায় প্রস্তুত। হটলাইনে কল করে বা ইমেইলে যোগাযোগ করতে পারবেন।",
  },
  {
    question: "বিদ্যুৎ চলে গেলে কি হবে?",
    answer:
      "SOHUB Protect সিস্টেমে বিল্ট-ইন ব্যাটারি ব্যাকআপ রয়েছে। বিদ্যুৎ চলে গেলেও সিস্টেম কয়েক ঘণ্টা চালু থাকবে এবং আপনাকে নোটিফিকেশন পাঠাবে।",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 lg:py-32 bg-muted/30">
      <div className="section-container">
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-primary font-medium mb-4">
            সচরাচর জিজ্ঞাসা
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            আপনার প্রশ্নের উত্তর
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background rounded-2xl border border-border/50 px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
