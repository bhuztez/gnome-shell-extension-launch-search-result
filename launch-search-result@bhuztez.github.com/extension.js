/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */
const Lang = imports.lang;
const Clutter = imports.gi.Clutter;
const Shell = imports.gi.Shell;
const Main = imports.ui.main;

function find_selected_icon() {
    let tab = Main.overview.viewSelector._searchTab;
    if (!tab.active)
        return null;

    let results = tab._searchResults;
    if (results._selectedOpenSearchButton != -1)
        return null;
    
    let current = results._selectedProvider;
    if (current < 0)
        return null;

    let resultDisplay = results._providerMeta[current].resultDisplay;
    if (resultDisplay.selectionIndex < 0)
        return null;

    let targetActor = resultDisplay._grid.getItemAtIndex(resultDisplay.selectionIndex);

    let icon = targetActor._delegate._content._delegate;
    if ('_menu' in icon)
        return icon;

    return null;
}

function main() {
    Main.overview.viewSelector._searchTab._text.connect(
        'key-press-event',
        function(entry, event){
            let icon = find_selected_icon();
            if (icon) {
                let symbol = event.get_key_symbol();
                if (symbol == Clutter.Menu) {
                    icon.popupMenu();
                    return true;
                } else if (symbol == Clutter.Return) {
                    let modifiers = Shell.get_event_state(event);
                    if (modifiers == Clutter.ModifierType.SHIFT_MASK) {
                        let launchWorkspace = global.screen.get_workspace_by_index(global.screen.n_workspaces - 1);
                        launchWorkspace.activate(global.get_current_time());
                        icon.emit('launching');
                        icon.app.open_new_window(-1);
                        Main.overview.hide();
                    } else if (modifiers == Clutter.ModifierType.CONTROL_MASK) {
                        icon.emit('launching');
                        icon.app.open_new_window(-1);
                        Main.overview.hide();
                        return true;
                    }
                }
            }

            return false;
	});
}

