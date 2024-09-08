import { extractPageContent, initializePageContent, replaceVariables } from './utils/content-extractor.js';
import { findMatchingTemplate } from './utils/template-utils.js';
import { generateFrontmatter, saveToObsidian } from './utils/obsidian-note-creator.js';
import { decompressFromUTF16 } from 'lz-string';

chrome.action.onClicked.addListener((tab) => {
	if (tab.id) {
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			files: ['content.js']
		});
	}
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "extractContent" && sender.tab && sender.tab.id) {
		chrome.tabs.sendMessage(sender.tab.id, request, sendResponse);
		return true;
	}
});

chrome.commands.onCommand.addListener(async (command) => {
	if (command === 'quick_clip') {
		const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
		if (!tab.id || !tab.url) return;

		// Open the popup
		await chrome.action.openPopup();

		// Wait for the popup to be ready
		await new Promise(resolve => setTimeout(resolve, 500));

		// Send a message to the popup to trigger quick clipping
		chrome.runtime.sendMessage({action: "triggerQuickClip"}, response => {
			if (chrome.runtime.lastError) {
				console.error("Failed to send quick clip message:", chrome.runtime.lastError);
			}
		});
	}
});
