"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

interface TextAnimationProps {}

const TextAnimation: React.FC<TextAnimationProps> = () => {
    const textRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    const texts = [
        "Revolutionizing Legal Research in Pakistan",
        "Elevate Your Legal Research with AI Attorney - The AI-Powered Solution",
        "Empowering Legal Professionals with Accurate and Efficient Case Law Research",
        "Maximize Your Time with AI Attorney’s Intelligent Legal Insights",
    ];

    useEffect(() => {
        if (!textRef.current || !cursorRef.current) return;

        const tl = gsap.timeline({
            repeat: -1,
            delay: 1,
            repeatDelay: 0.2,
        });

        texts.forEach((text, i) => {
            if (i !== 0) {
                tl.set(textRef.current, {
                    text: "",
                    opacity: 1,
                    x: 0,
                    color: "#000",
                });
                tl.set(cursorRef.current, { opacity: 1, x: 0 });
            }

            tl.to(textRef.current, {
                duration: text.length * 0.1,
                text: text,
                ease: "none",
                onStart: () => {
                    textRef.current!.innerHTML = "";
                }
            })
                .to([textRef.current, cursorRef.current], {
                    duration: 2,
                    ease: "none",
                })
                // .to(textRef.current, {
                //     scale: 0.6,
                //     rotation: 2,
                //     repeat: 1,
                //     yoyo: true,
                //     duration: 0.6,
                //     ease: "power1.inOut",
                // })
                .to(textRef.current, {
                    x: "-200%",
                    opacity: 0,
                    duration: 2,
                    ease: "power1.in",
                })
                .to(cursorRef.current, {
                    x: "-170%",
                    opacity: 0,
                    duration: 0.5,
                    ease: "power1.in",
                });
        });

        gsap.to(cursorRef.current, {
            opacity: 0.5,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
            duration: 0.5,
        });

        return () => {
            tl.kill(); // Clean up the timeline when the component unmounts
        };
    }, [texts]);

    return (
        <div className="flex items-center space-x-1">
            <div ref={textRef} className="inline-block font-semibold text-3xl"></div>
            <div ref={cursorRef} className="inline-block font-semibold text-3xl">|</div>
        </div>
    );
};

export default TextAnimation;
