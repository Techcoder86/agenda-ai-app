// server.js - AgendaAI Pro - Final, Working & Corrected Version
require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());

// --- HTML CONTENT ---
// This string is now clean and contains no server-side variables.
const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AgendaAI Pro - Instant Professional Agendas</title>
    <script src="https://js.stripe.com/v3/"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-hue: 210;
            --primary: hsl(var(--primary-hue), 90%, 65%);
            --bg-dark: #0d1117;
            --bg-card: #161b22;
            --border-color: #30363d;
            --text-light: #e6edf3;
            --text-muted: #8b949e;
            --success: #238636;
            --radius: 12px;
            --shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
        body { background-color: var(--bg-dark); color: var(--text-light); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        .site-header { position: sticky; top: 0; width: 100%; padding: 1rem 2rem; background: rgba(13, 17, 23, 0.8); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border-color); z-index: 100; }
        .site-nav { display: flex; justify-content: space-between; align-items: center; max-width: 1000px; margin: 0 auto; }
        .logo { display: flex; align-items: center; gap: 12px; font-size: 1.25rem; font-weight: 700; color: var(--text-light); text-decoration: none; }
        .logo i { color: var(--primary); }
        .header-cta { padding: 0.5rem 1rem; font-size: 0.9rem; font-weight: 600; color: var(--primary); border: 1px solid var(--primary); border-radius: var(--radius); text-decoration: none; transition: all 0.2s; }
        .header-cta:hover { background-color: hsla(var(--primary-hue), 90%, 65%, 0.1); }
        .page-wrapper { max-width: 1000px; margin: 0 auto; padding: 4rem 2rem; }
        .hero { text-align: center; margin-bottom: 5rem; }
        .hero h1 { font-size: 3.5rem; font-weight: 800; color: var(--text-light); margin-bottom: 1.5rem; letter-spacing: -2px; }
        .hero p { font-size: 1.25rem; color: var(--text-muted); max-width: 650px; margin: 0 auto 2.5rem; line-height: 1.6; }
        .cta-button { padding: 1rem 2.5rem; font-size: 1.1rem; font-weight: 600; color: #0d1117; background: var(--primary); border: none; border-radius: var(--radius); cursor: pointer; box-shadow: 0 4px 14px 0 hsla(var(--primary-hue), 90%, 65%, 0.39); transition: all 0.2s ease-in-out; }
        .cta-button:hover { transform: translateY(-3px); box-shadow: 0 6px 20px 0 hsla(var(--primary-hue), 90%, 65%, 0.45); }
        .cta-button:disabled { background-color: #8b949e; cursor: not-allowed; transform: none; box-shadow: none; }
        .animated-demo { width: 100%; max-width: 800px; margin: 4rem auto 0; background: #010409; border-radius: var(--radius); box-shadow: var(--shadow); border: 1px solid var(--border-color); }
        .demo-header { display: flex; align-items: center; padding: 0.75rem 1rem; border-bottom: 1px solid var(--border-color); }
        .demo-header .traffic-lights { display: flex; gap: 8px; }
        .demo-header .traffic-lights span { width: 12px; height: 12px; border-radius: 50%; background-color: #30363d; }
        #reloadDemoBtn { margin-left: auto; background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1rem; transition: color 0.2s, transform 0.2s; }
        #reloadDemoBtn:hover { color: white; transform: rotate(45deg); }
        #reloadDemoBtn:disabled { color: #475569; cursor: not-allowed; transform: none; }
        .demo-window { background: var(--bg-card); border-radius: 0 0 10px 10px; padding: 1.5rem; display: flex; gap: 1.5rem; min-height: 450px; }
        .demo-panel { flex: 1; display: flex; flex-direction: column; }
        .demo-panel h4 { font-size: 0.9rem; letter-spacing: 1px; color: var(--text-muted); margin-bottom: 1rem; text-align: left;}
        #demo-notes-container { flex: 1; background: var(--bg-dark); border: 1px solid var(--border-color); border-radius: 6px; padding: 1rem; font-family: monospace; font-size: 0.9rem; white-space: pre-wrap; color: #c9d1d9; overflow-wrap: break-word; }
        #demo-generate-btn { width: 100%; padding: 0.5rem; margin-top: 1rem; font-weight: 600; border-radius: 6px; color: var(--text-light); border: 1px solid var(--border-color); background: #21262d; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        #demo-generate-btn.loading { background: var(--primary); color: #0d1117; border-color: var(--primary); }
        #demo-agenda-container { flex: 1; opacity: 0; transition: opacity 0.5s ease-in; }
        #demo-agenda-container.visible { opacity: 1; }
        .demo-agenda-item { opacity: 0; transform: translateY(15px); padding: 0.75rem; background: var(--bg-dark); border: 1px solid var(--border-color); border-radius: 6px; margin-bottom: 0.75rem; font-size: 0.9rem; text-align: left; transition: opacity 0.4s ease-out, transform 0.4s ease-out; position: relative; }
        .demo-agenda-item:hover .copy-btn { opacity: 1; }
        .demo-agenda-item.is-visible { opacity: 1; transform: translateY(0); }
        .demo-agenda-item i { margin-right: 8px; color: var(--primary); min-width: 20px; text-align: center; }
        .demo-agenda-item strong { color: var(--text-light); }
        .demo-agenda-item ul { list-style: none; padding-left: 0; margin-top: 0.5rem; }
        .demo-agenda-item li { padding: 0.25rem 0; color: var(--text-muted); }
        .copy-btn { position: absolute; top: 0.5rem; right: 0.5rem; background: #21262d; border: 1px solid var(--border-color); color: var(--text-muted); border-radius: 4px; padding: 4px 6px; font-size: 0.7rem; cursor: pointer; opacity: 0; transition: all 0.2s; }
        .copy-btn:hover { background: var(--primary); color: var(--bg-dark); }
        .copy-btn.copied { background: var(--success); color: white; border-color: var(--success); }
        .section-header { text-align: center; margin: 6rem 0 3rem; }
        .section-header h2 { font-size: 2.5rem; font-weight: 700; margin-bottom: 1rem; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
        .feature-card { background: var(--bg-card); padding: 2rem; border-radius: var(--radius); border: 1px solid var(--border-color); text-align: center; }
        .feature-card i { font-size: 2rem; color: var(--primary); margin-bottom: 1rem; }
        .feature-card h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
        .pricing-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius); padding: 2.5rem; max-width: 450px; margin: 0 auto; text-align: center; }
        .pricing-card .deal-type { font-weight: 600; color: var(--primary); margin-bottom: 1rem; }
        .pricing-card .price { font-size: 3.5rem; font-weight: 800; color: var(--text-light); }
        .pricing-card .price span { font-size: 1rem; color: var(--text-muted); font-weight: 400; }
        .pricing-card .features-list { list-style: none; padding: 0; margin: 2rem 0; text-align: left; max-width: 250px; margin-left: auto; margin-right: auto;}
        .pricing-card .features-list li { margin-bottom: 1rem; display: flex; align-items: center; }
        .pricing-card .features-list i { color: var(--success); margin-right: 0.75rem; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; }
        .testimonial-card { background: var(--bg-card); padding: 2rem; border-radius: var(--radius); border: 1px solid var(--border-color); }
        .testimonial-content { transition: opacity 0.3s ease-in-out; }
        .testimonial-content.is-updating { opacity: 0; }
        .testimonial-card p:first-of-type { font-style: italic; color: var(--text-muted); border-left: 3px solid var(--primary); padding-left: 1.5rem; margin-bottom: 1rem; min-height: 100px; }
        .testimonial-author { text-align: right; font-weight: 600; }
        .testimonial-author span { font-weight: 400; color: var(--text-muted); }
    </style>
</head>
<body>
    <header class="site-header">
        <nav class="site-nav">
            <a href="#" class="logo">
                <i class="fa-solid fa-calendar-check"></i>
                AgendaAI Pro
            </a>
            <a href="#pricing" class="header-cta">Get Started</a>
        </nav>
    </header>
    <div class="page-wrapper">
        <header class="hero">
            <h1>Turn Chaotic Notes into Flawless Agendas. Instantly.</h1>
            <p>Stop wasting time deciphering messy notes. AgendaAI Pro analyzes your raw text and transforms it into a structured, professional meeting agenda in one click.</p>
            <button id="getAccessBtn" class="cta-button"><i class="fa-solid fa-bolt"></i> Get Instant Access</button>
        </header>
        <main>
            <div class="animated-demo">
                <div class="demo-header">
                    <div class="traffic-lights"><span></span><span></span><span></span></div>
                    <button id="reloadDemoBtn" title="Try another example"><i class="fa-solid fa-sync"></i></button>
                </div>
                <div class="demo-window">
                    <div class="demo-panel">
                        <h4>YOUR RAW NOTES</h4>
                        <div id="demo-notes-container"></div>
                        <button id="demo-generate-btn">Generate Agenda</button>
                    </div>
                    <div class="demo-panel">
                        <h4>GENERATED AGENDA</h4>
                        <div id="demo-agenda-container">
                            <div id="demo-agenda-title" class="demo-agenda-item"></div>
                            <div id="demo-agenda-goal" class="demo-agenda-item"></div>
                            <div id="demo-agenda-topics" class="demo-agenda-item"></div>
                            <div id="demo-agenda-question" class="demo-agenda-item"></div>
                        </div>
                    </div>
                </div>
            </div>
            <section class="features">
                <div class="section-header"><h2>Everything You Need to Run Better Meetings</h2></div>
                <div class="features-grid">
                    <div class="feature-card"><i class="fa-solid fa-wand-magic-sparkles"></i><h3>AI-Powered Structuring</h3><p>Our advanced AI identifies key themes, goals, and questions from any text.</p></div>
                    <div class="feature-card"><i class="fa-solid fa-file-export"></i><h3>One-Click Export</h3><p>Copy your structured agenda as clean text, ready to paste into any email or document.</p></div>
                    <div class="feature-card"><i class="fa-solid fa-shield-halved"></i><h3>Secure & Private</h3><p>Your data is processed securely and is never stored or used for training.</p></div>
                </div>
            </section>
            <section id="pricing" class="pricing">
                <div class="section-header"><h2>Simple, One-Time Pricing</h2></div>
                <div class="pricing-card">
                    <p class="deal-type">LIFETIME DEAL</p>
                    <p class="price">$19 <span>/ one-time</span></p>
                    <p class="text-muted">Pay once, use forever. No subscriptions.</p>
                    <ul class="features-list">
                        <li><i class="fa-solid fa-check-circle"></i> Unlimited Agenda Generations</li>
                        <li><i class="fa-solid fa-check-circle"></i> Lifetime Access to Updates</li>
                        <li><i class="fa-solid fa-check-circle"></i> Priority Customer Support</li>
                        <li><i class="fa-solid fa-check-circle"></i> Secure & Private Processing</li>
                    </ul>
                    <button id="pricingCtaBtn" class="cta-button" style="width: 100%;">Get Lifetime Access</button>
                </div>
            </section>
            <section class="testimonials">
                <div class="section-header"><h2>Trusted by Professionals Worldwide</h2></div>
                <div class="testimonials-grid" id="testimonials-grid">
                    <div class="testimonial-card">
                        <div class="testimonial-content">
                            <p></p>
                            <p class="testimonial-author"></p>
                        </div>
                    </div>
                    <div class="testimonial-card">
                        <div class="testimonial-content">
                             <p></p>
                             <p class="testimonial-author"></p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>
    <script>
    // This script is now clean, standard browser JavaScript.
    // It will fetch its configuration from the server first.
    document.addEventListener('DOMContentLoaded', async function() {
        // --- DATA & ELEMENT SELECTIONS (Unchanged) ---
        const demoData = [{"notes":"ok so for the odyssey kickoff we NEED to talk about the budget, it's tight. maybe shift from paid social ads to more content marketing? jenna is handling the new hires, need to sync with her on their start dates. also the launch for the apollo project in q3 was a disaster, we have to do a full post-mortem on what went wrong before we even think about a new launch. mktg team needs the final assets by the 15th. coffee machine is broken again.","agenda":{"title":"Project Odyssey: Q4 Kickoff & Strategy","goal":"Establish a clear roadmap and address key risks for the Project Odyssey launch.","topics":["Q3 Apollo Project: Post-Mortem & Key Learnings","Final Budget Allocation & Resource Planning","Odyssey Marketing & Content Strategy","New Hire Integration Timeline"],"question":"What is the primary blocker for a successful Q4 launch, and how do we mitigate it?"}},{"notes":"Follow up from the call with Mark at Innovate Inc. He seemed to like the design mockups which is good. He said the pricing was 'a bit higher than expected' - maybe we can offer a payment plan or a reduced scope for phase 1? also, timeline is critical for them, they really want it before the holidays. He asked 'can we integrate our old blog posts?' - need to check with dev team on this, could be tricky. I need to send them the revised contract by EOD friday.","agenda":{"title":"Follow-up: Innovate Inc. Website Proposal","goal":"Address client feedback and finalize the project proposal for immediate kickoff.","topics":["Pricing & Payment Plan Options","Timeline Confirmation for Holiday Launch","Technical Requirement: Blog Integration","Next Steps & Contract Revision"],"question":"What adjustments are needed to get full project sign-off this week?"}}];
        const testimonialsData = [{"quote":"This has saved me hours each week. I can go from a messy brain-dump to a client-ready agenda in seconds. A total game-changer.","author":"Sarah J.","title":"Project Manager, TechCorp"},{"quote":"I was skeptical at first, but the quality of the agendas is shockingly good. It understands context and creates a perfect starting point for any meeting.","author":"Michael B.","title":"Startup Founder"},{"quote":"As a consultant, I'm in back-to-back meetings. AgendaAI Pro ensures every single one is productive and focused. I can't imagine my workflow without it.","author":"Dr. Emily C.","title":"Management Consultant"},{"quote":"The best $19 I've spent on productivity software. It's simple, fast, and does exactly what it promises. Highly recommended.","author":"David L.","title":"Freelance Developer"},{"quote":"We implemented this for our whole team. Our meetings are shorter, more focused, and we actually accomplish what we set out to do.","author":"Jessica R.","title":"Head of Operations"}];
        const getAccessBtn = document.getElementById('getAccessBtn');
        const pricingCtaBtn = document.getElementById('pricingCtaBtn');
        const reloadDemoBtn = document.getElementById('reloadDemoBtn');
        const notesContainer = document.getElementById('demo-notes-container');
        const generateBtn = document.getElementById('demo-generate-btn');
        const agendaContainer = document.getElementById('demo-agenda-container');
        const agendaItems = { title: document.getElementById('demo-agenda-title'), goal: document.getElementById('demo-agenda-goal'), topics: document.getElementById('demo-agenda-topics'), question: document.getElementById('demo-agenda-question'),};
        const testimonialContents = document.querySelectorAll('.testimonial-content');

        // --- ANIMATION FUNCTIONS (Unchanged) ---
        let currentDemoIndex = 0;
        let isAnimating = false;
        let lastTestimonialIndices = [-1, -1];
        let testimonialInterval;
        const delay = ms => new Promise(res => setTimeout(res, ms));
        async function typeWriter(element, text, speed = 25) { element.innerHTML = ""; for (let i = 0; i < text.length; i++) { element.innerHTML += text.charAt(i); await delay(speed); } }
        function createCopyButton(textToCopy) { const button = document.createElement('button'); button.className = 'copy-btn'; button.innerHTML = '<i class="fa-solid fa-copy"></i>'; button.onclick = (e) => { e.stopPropagation(); navigator.clipboard.writeText(textToCopy); button.innerHTML = '<i class="fa-solid fa-check"></i> Copied!'; button.classList.add('copied'); setTimeout(() => { button.innerHTML = '<i class="fa-solid fa-copy"></i>'; button.classList.remove('copied'); }, 2000); }; return button; }
        async function updateTestimonials() { testimonialContents.forEach(content => content.classList.add('is-updating')); await delay(300); let index1, index2; do { index1 = Math.floor(Math.random() * testimonialsData.length); } while (lastTestimonialIndices.includes(index1)); do { index2 = Math.floor(Math.random() * testimonialsData.length); } while (index1 === index2 || lastTestimonialIndices.includes(index2)); lastTestimonialIndices = [index1, index2]; const reviews = [testimonialsData[index1], testimonialsData[index2]]; testimonialContents.forEach((content, i) => { content.querySelector('p:first-of-type').textContent = \`"\${reviews[i].quote}"\`; content.querySelector('.testimonial-author').innerHTML = \`\${reviews[i].author} - <span>\${reviews[i].title}</span>\`; }); testimonialContents.forEach(content => content.classList.remove('is-updating')); }
        async function runDemo() { if (isAnimating) return; isAnimating = true; reloadDemoBtn.disabled = true; agendaContainer.classList.remove('visible'); Object.values(agendaItems).forEach(item => { item.classList.remove('is-visible'); item.innerHTML = ""; }); const demo = demoData[currentDemoIndex]; await typeWriter(notesContainer, demo.notes); generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...'; generateBtn.classList.add('loading'); await delay(1500); agendaContainer.classList.add('visible'); const titleText = demo.agenda.title; agendaItems.title.innerHTML = \`<strong>\${titleText}</strong>\`; agendaItems.title.appendChild(createCopyButton(titleText)); agendaItems.title.classList.add('is-visible'); await delay(300); const goalText = \`Goal: \${demo.agenda.goal}\`; agendaItems.goal.innerHTML = \`<i class="fa-solid fa-bullseye"></i><strong>\${goalText}</strong>\`; agendaItems.goal.appendChild(createCopyButton(goalText)); agendaItems.goal.classList.add('is-visible'); await delay(300); const topicsText = demo.agenda.topics.join('\\n'); const topicList = document.createElement('ul'); demo.agenda.topics.forEach(topic => { const li = document.createElement('li'); li.textContent = \`• \${topic}\`; topicList.appendChild(li); }); agendaItems.topics.innerHTML = \`<i class="fa-solid fa-list-check"></i><strong>Discussion Topics:</strong>\`; agendaItems.topics.appendChild(topicList); agendaItems.topics.appendChild(createCopyButton(topicsText)); agendaItems.topics.classList.add('is-visible'); await delay(300); const questionText = \`Key Question: \${demo.agenda.question}\`; agendaItems.question.innerHTML = \`<i class="fa-solid fa-circle-question"></i><strong>\${questionText}</strong>\`; agendaItems.question.appendChild(createCopyButton(questionText)); agendaItems.question.classList.add('is-visible'); generateBtn.innerHTML = 'Generate Agenda'; generateBtn.classList.remove('loading'); reloadDemoBtn.disabled = false; isAnimating = false; }
        function startTestimonialCycle() { clearInterval(testimonialInterval); updateTestimonials(); testimonialInterval = setInterval(updateTestimonials, 7000); }
        
        // --- PAYMENT & INITIALIZATION LOGIC ---
        let stripe;

        // Fetch the config and initialize Stripe
        try {
            const response = await fetch('/config');
            const config = await response.json();
            stripe = Stripe(config.publishableKey);
        } catch (e) {
            console.error("Could not fetch config from server.", e);
            alert("Error: Could not initialize payment system.");
        }

        const handleCheckout = async () => {
            if (!stripe) {
                alert("Payment system is not ready. Please refresh the page.");
                return;
            }
            getAccessBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            pricingCtaBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            getAccessBtn.disabled = true;
            pricingCtaBtn.disabled = true;
            try {
                const response = await fetch('/create-checkout-session', { method: 'POST' });
                const session = await response.json();
                if (response.ok) {
                    const result = await stripe.redirectToCheckout({ sessionId: session.id });
                    if (result.error) { alert(result.error.message); }
                } else {
                    alert(session.error || 'Could not connect to payment gateway.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An unexpected error occurred. Please try again.');
            }
            getAccessBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> Get Instant Access';
            pricingCtaBtn.innerHTML = 'Get Lifetime Access';
            getAccessBtn.disabled = false;
            pricingCtaBtn.disabled = false;
        };
        
        getAccessBtn.addEventListener('click', handleCheckout);
        pricingCtaBtn.addEventListener('click', handleCheckout);
        reloadDemoBtn.addEventListener('click', () => {
            currentDemoIndex = (currentDemoIndex + 1) % demoData.length;
            runDemo();
            startTestimonialCycle();
        });

        // --- INITIALIZE THE PAGE ---
        runDemo();
        startTestimonialCycle();
    });
    </script>
</body>
</html>
`;

// Simple, themed HTML for the success and cancel pages
const successHtml = `<!DOCTYPE html><html><head><title>Thanks for your order!</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet"><style>body{background-color: #0d1117; color: #e6edf3; font-family: 'Inter', sans-serif; text-align: center; padding: 50px;} h1{color: #238636; font-weight: 600;} a{color: hsl(210, 90%, 65%); font-weight: 600; text-decoration: none;} a:hover{text-decoration: underline;}</style></head><body><h1>✓ Payment Successful!</h1><p>Thank you for your purchase. Welcome to AgendaAI Pro!</p><br/><a href="/">← Go back to the homepage</a></body></html>`;
const cancelHtml = `<!DOCTYPE html><html><head><title>Order Canceled</title><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet"><style>body{background-color: #0d1117; color: #e6edf3; font-family: 'Inter', sans-serif; text-align: center; padding: 50px;} h1{color: #e6edf3; font-weight: 600;} a{color: hsl(210, 90%, 65%); font-weight: 600; text-decoration: none;} a:hover{text-decoration: underline;}</style></head><body><h1>Order Canceled</h1><p>Your payment was not processed and you have not been charged.</p><br/><a href="/">← Go back and try again</a></body></html>`;

// --- SERVER ROUTES ---
app.get('/', (req, res) => res.send(indexHtml));
app.get('/success.html', (req, res) => res.send(successHtml));
app.get('/cancel.html', (req, res) => res.send(cancelHtml));

// NEW: A route to provide the publishable key to the frontend
app.get('/config', (req, res) => {
    res.json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});

// The secure backend endpoint for creating the Stripe Checkout Session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'AgendaAI Pro - Lifetime Access' },
                    unit_amount: 1900,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `http://localhost:4242/success.html`,
            cancel_url: `http://localhost:4242/cancel.html`,
        });
        res.json({ id: session.id });
    } catch (error) {
        console.error("Stripe Error:", error.message);
        res.status(500).json({ error: 'Failed to create payment session.' });
    }
});

// --- START THE SERVER ---
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));