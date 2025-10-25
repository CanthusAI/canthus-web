const faqs = [
    {
        question: "How does the Clio integration work?",
        answer: "Our tools integrate seamlessly with your existing Clio workspace. Once installed, you can access all accessibility features directly within your case management workflow."
    },
    {
        question: "What makes documents more accessible?",
        answer: "Our alt-text generator creates descriptions for images, the legalese translator simplifies complex legal language, and our PDF reader ensures all documents are screen-reader compatible."
    },
    {
        question: "Do you offer training for my team?",
        answer: "Yes! Pro plan includes priority support and training to help your team make the most of accessibility features and serve clients with diverse needs."
    },
    {
        question: "Can I white-label the solution?",
        answer: "The Pro plan includes white-label options, allowing you to customize the interface with your firm's branding while providing accessibility tools to your clients."
    },
    {
        question: "How do client accommodations work?",
        answer: "Our system stores accessibility preferences for each client, automatically applying appropriate accommodations like large text, high contrast, or audio descriptions for future interactions."
    },
    {
        question: "Is there ongoing support?",
        answer: "Both plans include support, with Pro customers receiving priority assistance for implementation, training, and any accessibility questions that arise."
    }
];

export default function FAQ() {
    return (
        <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-12">
                Frequently Asked Questions
            </h3>
            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-border pb-6 last:border-b-0">
                        <h4 className="font-semibold mb-2 text-lg">
                            {faq.question}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed">
                            {faq.answer}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
