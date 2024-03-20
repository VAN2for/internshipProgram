

type GenreType = "HyperCasual" | "Puzzle" | "Simulation" | "Arcade" | "Strategy" | "Casino" | "Shooter" | "RPG" | "Lifestyle";
const NUC = window["NUC"];

/**
 * The compiled HTML file must include the Nucleo source code as an inline script.
 */
class NucManager {

    public static checkNuc(): boolean {
        return NUC != null && ps.channel == "ironsource";
    }

    /**
     * ### The initialization step must be added right after the Nucleo script
     * @param gameName game name
     * @param genre game type
     * @param version game version.
     */
    public static init(gameName: string, genre: GenreType, version: number): void {
        if (!NucManager.checkNuc()) return;
        NUC.init("pa", gameName, genre, `9.0.${version}`);
        NUC.callback.onStart((width, height, isMuted) => {
            // the game is good to go
            console.log("NUC on start", width, height, isMuted);
        });
    }

    /**
     * Whenever your creative is ready to go and your assets have been loaded.
     * ### Must be triggered when the game is ready (assets loaded, etc.)
     */
    public static ready(): void {
        if (!NucManager.checkNuc()) return;
        NUC.trigger.ready();
    }

    /**
     * Autoplay means a specific gameplay segment has been triggered due to user inactivity.
     */
    public static autoplay(): void {
        if (!NucManager.checkNuc()) return;
        NUC.trigger.autoplay();
    }

    /**
     * Use this trigger to track each user interaction.
     * ### Must be triggered on the first user interaction
     */
    public static interaction(): void {
        if (!NucManager.checkNuc()) return;
        NUC.trigger.interaction();
    }

    /**
     * Use this trigger when a new level has started.
     */
    public static startLevel(): void {
        if (!NucManager.checkNuc()) return;
        NUC.trigger.startLevel();
    }

    /**
     * Use this trigger when a level has ended.
     */
    public static endLevel(): void {
        if (!NucManager.checkNuc()) return;
        NUC.trigger.endLevel();
    }

    /**
     * Use this trigger for playables without levels, to define the middle of gameplay progress.
     * Note: The Midway progress event can be sent only once
     */
    public static midwayProgress(): void {
        if (!NucManager.checkNuc()) return;
        NUC.trigger.midwayProgress();
    }

    /**
     * Use this trigger to determine game ending by Win, Lose or Timeout (use timeout when a game has ended through autoplay).
     * ### Must be triggered on any game ending
     */
    public static endGame(type: 'win' | 'lose' | 'timer'): void {
        if (!NucManager.checkNuc()) return;
        NUC.trigger.endGame(type);
    }

    /**
     * Use this trigger once the user restarts gameplay, either for the whole game or for a specific level.
     */
    public static tryAgain(): void {
        if (!NucManager.checkNuc()) return;
        NUC.trigger.tryAgain();
    }

    /**
     * Use this trigger when the user presses any install button.
     * ### Must be triggered on every interaction which sends the user to the store
     */
    public static convert(): void {
        if (!NucManager.checkNuc()) return;
        NUC.trigger.convert();
    }
}