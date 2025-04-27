import { Player } from "@minecraft/server";
import { ActionFormData} from "@minecraft/server-ui";

interface FormButton {
    text: string,
    action: (source?: Player) => void
    icon?: string,
};

class BetterActionForm {
    protected form = new ActionFormData();
    private buttons: any = [];
    private title: string;
    private body: string;
    constructor(protected formTitle: string, protected formBody: string = "") {
        this.title = formTitle;
        this.body = formBody;

        this.form.title(this.title);
        this.form.body(this.body);
    };
    /**
     * 
     * @param data Data of a button
     */
    public button(data: FormButton): void {
        const { text, icon, action } = data;
        let form = this.form;
        try {
            if (icon) {
                if (!icon.startsWith('textures/')) throw "Invalid icon path.";
                form.button(text, icon);

                this.buttons.push({
                    buttonText: text,
                    buttonIcon: icon,
                    buttonAction: action
                });
            }
        } catch (e) {
            console.warn(e)
        }
    };

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
    public response(source: Player): void {
        this.form.show(source).then(res => {
            if (res.canceled) {
                source.playSound("random.enderchestclosed")
                return;
            }
            const sel = res.selection;
    
            if (sel !== undefined) {
                this.buttons[sel].buttonAction(source);
            }
        });
    }
}