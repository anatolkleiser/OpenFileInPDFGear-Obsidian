import { Plugin, normalizePath, TFile, Platform, FileSystemAdapter } from 'obsidian';
import { exec } from 'child_process';

export default class OpenInPDFGearPlugin extends Plugin {

	async onload() {
		const ribbonIconEl = this.addRibbonIcon('pencil-ruler', 'Open File In PDFGear', (evt: MouseEvent) => {
			const file = this.app.workspace.getActiveFile();
			if (file) this.openFileInPDFGear(file);
		});
		ribbonIconEl.addClass('open-in-PDFGear-ribbon-class');

		this.addCommand({
			id: 'open-in-pdfgear',
			name: 'Open current file in PDFGear',
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				if (file) {
					if (!checking) this.openFileInPDFGear(file);
					return true;
				}
			}
		});
	}

	onunload() {}

	openFileInPDFGear(file: TFile) {
		const path = this.getAbsolutePathOfFile(file);
		const app_ = "C:\\Program Files\\PDFgear\\PDFLauncher.exe";
		exec(`"${app_}" "${path}"`);
	}

	getAbsolutePathOfFile(file: TFile): string {
		const adapter = this.app.vault.adapter;
		const basePath = adapter instanceof FileSystemAdapter ? adapter.getBasePath() : '';
		const path = normalizePath(`${basePath}/${file.path}`);
		if (Platform.isDesktopApp && navigator.platform === "Win32") {
			return path.replace(/\//g, "\\");
		}
		return path;
	}
}