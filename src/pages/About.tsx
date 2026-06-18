import React, { ReactNode, useState } from "react";
import { Helmet } from "react-helmet-async";
import "./About.css";

export const About = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const faqItems: { question: string; answer: ReactNode }[] = [
        {
            question: "What's Giglist?",
            answer: (
                <>
                    <p>Giglist is a live music gig guide. Just live music.</p>
                    <p>
                        No karaoke, DJs, comedy, theatre, burlesque or book
                        launches (sorry).
                    </p>
                    <p>Giglist is always free to access and to list gigs.</p>
                    <p>Gigs in a list.</p>
                </>
            ),
        },
        {
            question: "How do I list a gig?",
            answer: (
                <>
                    <p>
                        Go to{" "}
                        <a href="https://giglist.com.au">giglist.com.au</a> and
                        click on Submit in the top right corner.
                    </p>
                    <p>
                        Fill in the submission form. You will not even need to
                        log in.
                    </p>
                    <p>
                        Or go straight to{" "}
                        <a href="https://giglist.com.au/submit">Submit</a>.
                    </p>
                </>
            ),
        },
        {
            question: "Why can't I see my gig yet?",
            answer: (
                <>
                    <p>
                        Giglist is a hand-curated live music gig guide. Every
                        gig is checked by a human. We clear submissions daily,
                        but not usually after 5pm AWST.
                    </p>
                    <p>
                        Sometimes we need to add venues to the system first, so
                        that can delay listing a little too. You can contact us
                        anytime: 0419 936 336.
                    </p>
                </>
            ),
        },
        {
            question: "I found a mistake on Giglist. WTF?",
            answer: (
                <>
                    <p>
                        Being hand-curated means humans make Giglist. So we make
                        mistakes.
                    </p>
                    <p>
                        Please let us know via the Edit Giglist form. Giglist
                        works because the community updates it.
                    </p>
                    <p>
                        Giglist is awesome because punters, musos and local
                        businesses make it so.
                    </p>
                </>
            ),
        },
        {
            question: "I have more questions about listing gigs.",
            answer: (
                <>
                    <p>
                        If a gig is missing, please list it. Most of Giglist is
                        populated by musos, venues, agents and drummer's
                        girlfriends.
                    </p>
                    <p>Gigs on Giglist must:</p>
                    <p>
                        1. Involve instruments and people creating music live
                        (no karaoke).
                    </p>
                    <p>
                        2. Be accessible to the public (not private functions).
                    </p>
                    <p>
                        3. Be professional (not busking or freebies). Someone
                        must be getting paid.
                    </p>
                    <p>
                        Tributes? Yes. Originals? Yes. Cafe and restaurant gigs?
                        Yes.
                    </p>
                    <p>
                        Support acts? Absolutely. How far ahead? Giglist
                        displays gigs up to a year in advance.
                    </p>
                </>
            ),
        },
        {
            question: "Why is this free?",
            answer: (
                <>
                    <p>
                        We think it is important. Plus one day we will be
                        RICH!!!
                    </p>
                    <p>Giglist is a free gig guide.</p>
                    <p>
                        Listing gigs and accessing Giglist will always be free.
                    </p>
                </>
            ),
        },
        {
            question: "What do you do with all that data?",
            answer: (
                <>
                    <p>We do not sell your data.</p>
                    <p>
                        We also provide Australian and state arts bodies with
                        data-driven insights into the live music community.
                    </p>
                </>
            ),
        },
    ];

    return (
        <>
            <Helmet>
                <title>About Giglist | Live Music Gig Guide</title>
                <link rel="canonical" href="https://giglist.com.au/about" />
                <meta
                    name="description"
                    content="Learn about Giglist, the live music gig guide built by locals for the local music community."
                />
                <meta property="og:title" content="About Giglist" />
                <meta
                    property="og:description"
                    content="Learn about Giglist, the live music gig guide built by locals for the local music community."
                />
                <meta
                    property="og:url"
                    content="https://giglist.com.au/about"
                />
            </Helmet>
            <div className="about-page">
                <div className="about-page__section about-page__hero">
                    <div className="about-page__inner about-page__inner--narrow">
                        <h1 className="about-page__hero-title about-page__type">
                            Australian live music gig guide
                        </h1>
                        <div className="about-page__hero-lines">
                            <h2 className="about-page__hero-line about-page__type">
                                Free
                            </h2>
                            <h2 className="about-page__hero-line about-page__type">
                                Inclusive
                            </h2>
                            <h2 className="about-page__hero-line about-page__type">
                                Est. 2017
                            </h2>
                            <h2 className="about-page__hero-line about-page__type">
                                Gigs. In a list.
                            </h2>
                        </div>
                        <a
                            href="/"
                            className="about-page__hero-link about-page__type"
                        >
                            Take me back to the gigs.
                        </a>
                    </div>
                </div>

                <div className="about-page__section">
                    <div className="about-page__inner">
                        <div className="about-page__stats">
                            <p className="about-page__stat">
                                1,770+ gigs currently listed
                            </p>
                            <p className="about-page__stat">
                                177,000+ gigs listed since 2017
                            </p>
                            <p className="about-page__stat">
                                1,770+ venues currently listed
                            </p>
                        </div>
                    </div>
                </div>

                <div className="about-page__section">
                    <div className="about-page__inner">
                        <h2 className="about-page__faq-title about-page__type">
                            Frequently Asked Questions
                        </h2>
                        <div className="about-page__faq">
                            {faqItems.map((item, index) => {
                                const isOpen = openFaqIndex === index;

                                return (
                                    <div
                                        className="about-page__faq-item"
                                        key={item.question}
                                    >
                                        <button
                                            className="about-page__faq-button"
                                            type="button"
                                            onClick={() =>
                                                setOpenFaqIndex(
                                                    isOpen ? null : index,
                                                )
                                            }
                                        >
                                            {item.question}
                                            <span>{isOpen ? "-" : "+"}</span>
                                        </button>
                                        {isOpen && (
                                            <div className="about-page__faq-content">
                                                {item.answer}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="about-page__section">
                    <div className="about-page__inner">
                        <div className="about-page__about-grid">
                            <div>
                                <img
                                    className="about-page__about-image"
                                    src="https://images.squarespace-cdn.com/content/v1/69b24e6e3c1cd15da3964fdb/145d9381-1a21-49ac-90cc-b0a1a609afa5/giglist+founders+no+face.png"
                                    alt="Giglist founders"
                                />
                            </div>
                            <div className="about-page__about-copy">
                                <h2 className="about-page__about-title about-page__type">
                                    About
                                    <br />
                                    Giglist
                                </h2>
                                <p className="about-page__about-lead">
                                    Giglist brings people together through the
                                    love of live music.
                                </p>
                                <p className="about-page__about-paragraph">
                                    In 2017 Giglist Guy created Giglist because
                                    'it needed to be done'.
                                </p>
                                <p className="about-page__about-paragraph">
                                    Giglist is created by musicians and curated
                                    by the live music community.
                                </p>
                                <p className="about-page__about-paragraph">
                                    Every city in the world needs a live music
                                    gig guide. Live music fans and musicians
                                    deserve a one-stop-shop to find gigs,
                                    without the distractions of karaoke, DJs,
                                    comedy, burlesque, theatre etc. The live
                                    music community of Perth WA, was missing
                                    this essential resource and relying on
                                    fledgling social media outlets.
                                </p>
                                <p className="about-page__about-paragraph">
                                    So, with the help of old band mate, Mr
                                    Lister, Giglist was created and we started
                                    listing gigs with a 'build it and they will
                                    come' ethos.
                                </p>
                                <p className="about-page__about-paragraph">
                                    A year later fellow musician and cloud
                                    developer Gigdev came on board and
                                    streamlined the listing process; enabling
                                    gigs to be listed faster and allowing
                                    musicians, venues & punters to list gigs.
                                </p>
                                <p className="about-page__about-paragraph">
                                    With no advertising budget, Giglist grew
                                    purely by word of mouth.
                                </p>
                                <p className="about-page__about-paragraph">
                                    In 2025 Giglist expanded nationally with
                                    excellent feedback. It appears all of
                                    Australia appreciates a free, inclusive,
                                    live music gig guide.
                                </p>
                                <p className="about-page__about-paragraph">
                                    Gigs. In a list.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="about-page__section">
                    <div className="about-page__inner">
                        <h2 className="about-page__support-title about-page__type">
                            Support Giglist
                        </h2>
                        <div className="about-page__support-grid">
                            <a
                                href="https://giglist.deco-apparel.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    className="about-page__support-image"
                                    src="https://images.squarespace-cdn.com/content/v1/69b24e6e3c1cd15da3964fdb/15627e07-bce9-4b3c-943c-cfa5d34ddd16/buy+a+tee.png"
                                    alt="Buy a tee"
                                />
                            </a>
                            <a
                                href="https://buymeacoffee.com/giglist"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    className="about-page__support-image"
                                    src="https://images.squarespace-cdn.com/content/v1/69b24e6e3c1cd15da3964fdb/709d718d-ff6f-4c4a-98d4-de267954956c/buy+me+a+coffee.jpg"
                                    alt="Buy me a coffee"
                                />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="about-page__section">
                    <div className="about-page__inner about-page__inner--narrow about-page__contact-wrap">
                        <div className="about-page__contact-inner">
                            <h2 className="about-page__contact-title about-page__type">
                                Contact
                                <br />
                                Giglist
                            </h2>
                            <h4 className="about-page__contact-item">
                                Edit a listing
                            </h4>
                            <h4 className="about-page__contact-item">
                                Advertise with
                                <br />
                                Giglist
                            </h4>
                            <h4 className="about-page__contact-item">
                                Tech Queries
                            </h4>
                            <p>
                                <a
                                    className="about-page__contact-link"
                                    href="mailto:giglist@giglist.com.au"
                                >
                                    giglist@giglist.com.au
                                </a>
                            </p>
                            <p className="about-page__contact-small">
                                0419 936 336
                            </p>
                        </div>
                    </div>
                </div>

                <div className="about-page__section">
                    <div className="about-page__inner">
                        <h2 className="about-page__likes-title about-page__type">
                            Giglist likes...
                        </h2>
                        <div className="about-page__likes-grid">
                            <a
                                className="about-page__likes-link"
                                href="https://www.therockpit.net/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    className="about-page__likes-image about-page__likes-image--rockpit"
                                    src="https://images.squarespace-cdn.com/content/v1/69b24e6e3c1cd15da3964fdb/ec36fc0e-ffd4-4fe4-9434-85e45ed4d4be/rockpit.jpg"
                                    alt="The Rockpit"
                                />
                            </a>
                            <a
                                className="about-page__likes-link"
                                href="https://www.universalbar.com.au/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    className="about-page__likes-image about-page__likes-image--universal"
                                    src="https://images.squarespace-cdn.com/content/v1/69b24e6e3c1cd15da3964fdb/b0bc5646-9a28-4ab5-8775-509a1dd07fa9/universal.png"
                                    alt="Universal Bar"
                                />
                            </a>
                            <a
                                className="about-page__likes-link"
                                href="https://www.riprac.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    className="about-page__likes-image about-page__likes-image--riprac"
                                    src="https://images.squarespace-cdn.com/content/v1/69b24e6e3c1cd15da3964fdb/7129d6ce-fc6c-468f-a29a-ad9984826a26/riprac+logo.jpg"
                                    alt="RIPRAC"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
