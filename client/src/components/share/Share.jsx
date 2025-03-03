import React, { useState } from "react";
import { Copy, Share2, ChevronDown, ChevronUp, Check } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FaWhatsapp, FaInstagram, FaSnapchatGhost, FaPinterest, FaFacebookF } from "react-icons/fa";
import './Share.css'

const Share = ({ recipeTitle, recipeImage }) => {
    const [copied, setCopied] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);

    const titleBeforeBracket = recipeTitle.split('(')[0].trim();
    const sanitizedTitle = titleBeforeBracket.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const encodedTitle = encodeURIComponent(sanitizedTitle);
    const shareUrl = `${window.location.origin}/recipe/${encodedTitle}`;

    const websiteName = "disHcovery";

const shareMessages = [
  `🍽️ Just found a recipe that will make my taste buds do a happy dance! 💃✨ Try this delicious dish on ${websiteName}: ${shareUrl} 🚀 #${websiteName}`,
  `🍕 This recipe is so good, I might just marry it. 😍💍 Try it now: ${shareUrl} #FoodieLove`,
  `👩‍🍳 Cooking this might turn me into a MasterChef. Wanna try it too? 🔥 Check it out on ${websiteName}: ${shareUrl} 🍽️`,
  `🍩 Warning: This recipe is dangerously delicious. Proceed with caution. 🚀 Discover it here: ${shareUrl} 😋`,
  `🥑 AvocaDO try this recipe – it’s too good to miss! 🥑✨ Get it now: ${shareUrl} #HealthyEats`,
  `🍫 Chocolate, spice, and everything nice! This recipe is a must-try. 🍰 Indulge here: ${shareUrl} 😍`,
  `🌮 Life’s too short for bad food. This recipe = pure happiness! 😋 Taste it on ${websiteName}: ${shareUrl} #FoodieJoy`,
  `🥢 I found foodie heaven & I’m sharing it with you! 🔥 Grab the recipe here: ${shareUrl} 🍜`
];

// console.log(shareMessages);



    const randomMessage = shareMessages[Math.floor(Math.random() * shareMessages.length)];

    const socialLinks = [
        { name: "WhatsApp", icon: <FaWhatsapp />, url: `https://wa.me/?text=${encodeURIComponent(`${randomMessage} 🍽️ Try this: ${shareUrl}`)}` },
        { name: "Instagram", icon: <FaInstagram />, url: `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}` },
        { name: "Snapchat", icon: <FaSnapchatGhost />, url: `https://www.snapchat.com/share?url=${encodeURIComponent(shareUrl)}` },
        { name: "Pinterest", icon: <FaPinterest />, url: `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(recipeImage)}&description=${encodeURIComponent(randomMessage)}` },
        { name: "Facebook", icon: <FaFacebookF />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
        { name: "Twitter", icon: <FaXTwitter />, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(randomMessage)}` }
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleGenericShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: recipeTitle,
                    text: `${randomMessage} 🍽️ Try this recipe:`,
                    url: shareUrl,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            alert("Web Share API not supported on this browser.");
        }
    };

    const toggleShareOptions = () => {
        setShowShareOptions(!showShareOptions);
    };

    return (
        <div className="share-card">
            <h2 className="share-title">Share this Recipe</h2>

            {/* Main Buttons */}
            <div className="share-buttons-container">
                <button
                    onClick={handleCopy}
                    className={`share-button copy-button ${copied ? 'copied' : ''}`}
                    disabled={copied}
                >
                    {copied ? <Check size={16} className="share-icon" /> : <Copy size={16} className="share-icon" />}
                    {/* {copied ? "Copied!" : "Copy Link"} */}
                </button>
                <button
                    onClick={handleGenericShare}
                    className="share-button generic-share-button"
                >
                    <Share2 size={16} />
                </button>
                <button
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className="share-button toggle-options-button"
                >
                    {showShareOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            {/* Social Media Icons with Animation */}
            {showShareOptions && (
                <div className="social-icons-grid">
                    {socialLinks.map(({ name, icon, url }) => (
                        <a
                            key={name}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`social-icon ${name.toLowerCase().replace(' ', '')}`}
                        >
                            {icon}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Share;