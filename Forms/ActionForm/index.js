import { ActionFormData } from "@minecraft/server-ui";
;
class BetterActionForm {
    #buttons = [];
    #title;
    #body;
    #form;
    constructor(formTitle, formBody = "") {
        this.formTitle = formTitle;
        this.formBody = formBody;
        this.#form = new ActionFormData();

        this.#title = formTitle;
        this.#body = formBody;

        this.#form.title(this.#title);
        this.#form.body(this.#body);
    }
    ;
    /**
     *
     * @param data Data of a button
     */
    button(data) {
        const { text, icon, action } = data;
        let form = this.form;
        try {
            if (icon) {
                if (!icon.startsWith('textures/'))
                    throw "Invalid icon path.";
                form.button(text, icon);
                this.#buttons.push({
                    buttonText: text,
                    buttonIcon: icon,
                    buttonAction: action
                });
            }
        }
        catch (e) {
            console.warn(e);
        }
    }
    ;
    /**
     * The form response (Handles showing the form and actions)
     * @example
     ```js
world.afterEvents.worldLoad.subscribe(() => {
    let form = new BetterActionForm("MyForm", `This is a better action form.`);
    form.button({
        text: "Creative", icon: "textures/items/stick", action: (player) => {
            player?.setGameMode(GameMode.creative);
            player?.sendMessage("Set gamemode to creative");
        }
    });

    form.button({
        text: "Survival", icon: "textures/items/diamond", action: (player) => {
            player?.setGameMode(GameMode.survival);
            player?.sendMessage("Set gamemode to survival");
        }
    });

    world.afterEvents.itemUse.subscribe(({ source: player, itemStack: item }) => {
        if (item?.typeId === "minecraft:clock") form.response(player);
    });
});
*/
    response(source) {
        this.#form.show(source).then(res => {
            if (res.canceled) {
                source.playSound("random.enderchestclosed");
                return;
            }
            const sel = res.selection;
            if (sel !== undefined) {
                this.#buttons[sel].buttonAction(source);
            }
        });
    }
}