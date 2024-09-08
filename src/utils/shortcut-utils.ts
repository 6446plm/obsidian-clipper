export async function getCommands(): Promise<{ [key: string]: chrome.commands.Command }> {
	return new Promise((resolve) => {
		chrome.commands.getAll((commands) => {
			const commandMap: { [key: string]: chrome.commands.Command } = {};
			commands.forEach((command) => {
				if (command.name) {
					commandMap[command.name] = command;
				}
			});
			resolve(commandMap);
		});
	});
}

export async function setCommand(commandName: string, shortcut: string): Promise<void> {
	return new Promise((resolve, reject) => {
		(chrome.commands as any).update({
			name: commandName,
			shortcut: shortcut
		}, () => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve();
			}
		});
	});
}