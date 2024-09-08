import { getCommands, setCommand } from './utils/shortcut-utils';

document.addEventListener('DOMContentLoaded', async function() {
	const shortcutActivateInput = document.getElementById('shortcut-activate') as HTMLInputElement;
	const shortcutQuickClipInput = document.getElementById('shortcut-quick-clip') as HTMLInputElement;
	const setShortcutActivateBtn = document.getElementById('set-shortcut-activate') as HTMLButtonElement;
	const setShortcutQuickClipBtn = document.getElementById('set-shortcut-quick-clip') as HTMLButtonElement;

	// Load current shortcuts
	const commands = await getCommands();
	shortcutActivateInput.value = commands['_execute_action']?.shortcut || '';
	shortcutQuickClipInput.value = commands['quick_clip']?.shortcut || '';

	setShortcutActivateBtn.addEventListener('click', () => setShortcut('_execute_action', shortcutActivateInput));
	setShortcutQuickClipBtn.addEventListener('click', () => setShortcut('quick_clip', shortcutQuickClipInput));

	async function setShortcut(commandName: string, inputElement: HTMLInputElement) {
		const newShortcut = await captureShortcut();
		if (newShortcut) {
			await setCommand(commandName, newShortcut);
			inputElement.value = newShortcut;
		}
	}

	async function captureShortcut(): Promise<string | null> {
		return new Promise((resolve) => {
			const modal = document.createElement('div');
			modal.className = 'shortcut-modal';
			modal.innerHTML = `
				<div class="shortcut-modal-content">
					<p>Press the desired shortcut keys</p>
					<p>(Press Esc to cancel)</p>
				</div>
			`;
			document.body.appendChild(modal);

			const keyHandler = (e: KeyboardEvent) => {
				e.preventDefault();
				if (e.key === 'Escape') {
					cleanup();
					resolve(null);
				} else {
					const shortcut = [
						e.ctrlKey ? 'Ctrl' : '',
						e.altKey ? 'Alt' : '',
						e.shiftKey ? 'Shift' : '',
						e.key.toUpperCase()
					].filter(Boolean).join('+');
					cleanup();
					resolve(shortcut);
				}
			};

			const cleanup = () => {
				document.removeEventListener('keydown', keyHandler);
				document.body.removeChild(modal);
			};

			document.addEventListener('keydown', keyHandler);
		});
	}
});