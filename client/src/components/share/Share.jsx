import React, { useState } from "react";
import { Copy, Share2, ChevronDown, ChevronUp, Check } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { useToast } from "../../contexts/ToastProvider";
import { FaWhatsapp, FaInstagram, FaSnapchatGhost, FaPinterest, FaFacebookF } from "react-icons/fa";
import './Share.css'

const Share = ({ recipeTitle, recipeImage }) => {
    const [copied, setCopied] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const {toast, showToast} = useToast();
    const titleBeforeBracket = recipeTitle.split('(')[0].trim();
    const sanitizedTitle = titleBeforeBracket.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const encodedTitle = encodeURIComponent(sanitizedTitle);
    const shareUrl = `${window.location.origin}/recipe/${encodedTitle}`;

    const websiteName = "disHcovery";

    const shareMessages = [
        `Discover an amazing recipe on ${websiteName}. A must-try dish: ${shareUrl}`,
        `Found something delicious on ${websiteName}. Try this recipe: ${shareUrl}`,
        `Bringing flavors to life! Try this recipe from ${websiteName}: ${shareUrl}`,
        `A dish worth sharing! Explore this recipe on ${websiteName}: ${shareUrl}`,
        `Cooking made better with this recipe from ${websiteName}. Check it out: ${shareUrl}`,
        `Unlock a new favorite dish on ${websiteName}. Explore the recipe here: ${shareUrl}`,
        `A perfect blend of taste and simplicity! Try this recipe on ${websiteName}: ${shareUrl}`
    ];

    const randomMessage = shareMessages[Math.floor(Math.random() * shareMessages.length)];

    const socialLinks = [
        { name: "WhatsApp", icon: <FaWhatsapp />, url: `https://wa.me/?text=${encodeURIComponent(randomMessage)}` },
        { name: "Instagram", icon: <FaInstagram />, url: `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}` },
        { name: "Snapchat", icon: <FaSnapchatGhost />, url: `https://www.snapchat.com/share?url=${encodeURIComponent(shareUrl)}` },
        {
            name: "Pinterest",
            icon: <FaPinterest />,
            url: `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.origin + "/recipe/" + encodedTitle)}&media=${encodeURIComponent(recipeImage)}&description=${encodeURIComponent("Check out this amazing recipe on disHcovery!")}`
        },
        
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
                    text: randomMessage,
                    url: shareUrl,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            showToast("Sharing is not supported on this browser.", "alert");
        }
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

            {/* Social Media Icons */}
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
