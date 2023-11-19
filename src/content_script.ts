(function () {
    if (window.location.pathname === "/promo") {
        log("is promo page, stop manager");
        return;
    }

    const timeOffsetAfterPromoStreamEndInMinutes: number = 3;
    const hasRedirected: boolean = !!sessionStorage.getItem("redirected");
    const isStreamPage: boolean = window.location.pathname.startsWith("/tw/");
    const embedContainer = document.querySelector("#twitch_pl") as HTMLElement;

    let embed: {
        addEventListener: (type: string, handler: () => void) => void
        getQualities: () => { name: string }[];
        setQuality: (name: string) => void
        setMuted: () => void
    };


    if (!hasRedirected) {
        log("Init App");
        redirectToIndex();
    } else if (isStreamPage) {
        log("is stream page");
        checkThisStreamCurrentlyPromo();
    } else {
        log("is index page, looking for promo link");
        const promoLink: HTMLLinkElement | null = document.querySelector("#promo_info a");
        if (promoLink && promoLink?.href) {
            const href: string = promoLink.href;
            log("promoLink found: ", href);
            if (!window.location.href.startsWith(href)) {
                log("redirecting to promo stream: ", href);
                sessionStorage.setItem("redirected", "true");
                window.location.href = promoLink.href;
            }
        } else {
            log("promo link is not found");
            startWaitingNextTimePoint();
        }
    }

    function startWaitingNextTimePoint(): void {
        const now: Date = new Date();
        const nextTimePoint: Date = new Date();
        nextTimePoint.setHours(now.getHours() + 1);
        nextTimePoint.setMinutes(timeOffsetAfterPromoStreamEndInMinutes);
        nextTimePoint.setSeconds(0);
        nextTimePoint.setMilliseconds(0);
        const delay: number = nextTimePoint.getTime() - now.getTime();

        log("start waiting next time point timeout, next time point is", nextTimePoint.toLocaleTimeString(), "time left:", (delay / 1000 / 60).toFixed(1), "minutes");

        setTimeout(() => {
            log("SUP: is next time point");
            if (isStreamPage) {
                checkThisStreamCurrentlyPromo();
            } else {
                window.location.reload();
            }
        }, delay);
    }

    function waitTwitchPlayerAppend() {
        initPlayer();
        /*setTimeout(() => {
            const twitchIFrame = document.querySelector("#twitch_pl iframe") as HTMLIFrameElement;
            if (twitchIFrame) {
                log("twitch iFrame found, waiting for player will be loaded");
                twitchIFrame.addEventListener("load",() => {
                    initPlayer();
                });
            } else {
                log("twitch iFrame not found, restart waiting timer");
                waitTwitchPlayerAppend();
            }
        }, 1000);*/
    }

    function checkThisStreamCurrentlyPromo(): void {
        log("SUP: check this stream is currently promo");
        const promoPercentElement: HTMLElement = document.querySelector("#promo-percent") as HTMLElement;
        if (promoPercentElement && getComputedStyle(promoPercentElement).display !== "none") {
            log("SUP: this stream is currently promo");
            startWaitingNextTimePoint();
            waitTwitchPlayerAppend();
        } else {
            log("SUP: this stream is not promo now");
            redirectToIndex();
        }
    }

    function redirectToIndex(): void {
        log("redirect to index and parse current promo link");
        sessionStorage.setItem("redirected", "true");
        window.location.href = "/";
    }

    function initPlayer(): void {
        log("Current window: ", window)
        //@ts-ignore
        debugger
        if (!document.defaultView?.hasOwnProperty("Twitch")) {
            log("twitch script not loaded, start waiting timer");
            log("setting timeout: ", window)
            setTimeout((): void => {
                log("Timeout handler: ", window);
                initPlayer();
            }, 1000);
        } else {
            log("twitch script has been loaded, getting player instance");
            /*//https://dev.twitch.tv/docs/embed/everything/
            const channelName: string = window.location.pathname.substring(4);
            embedContainer.innerHTML = "";
            //@ts-ignore
            embed = new Twitch.Embed("twitch_pl", {
                allowfullscreen: true,
                width: "100%",
                height: "100%",
                layout: "video",
                theme: "dark",
                channel: channelName,
                parent: ["stream-up.ru"]
            });
            //@ts-ignore
            embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
                log("Player loaded and ready, set mute, lower quality, and start streaming the channel: " + channelName);
                //player = embed.getPlayer();
                const qualities = embed.getQualities();
                const lowerQuality = qualities[qualities.length - 1];
                embed.setQuality(lowerQuality.name);
                embed.setMuted();
                log("------------------")
            });*/
        }

    }

    function log(...data: any[]): void {
        console.log(`SUM: [${new Date().toLocaleTimeString("ru-RU")}]`, ...data);
    }
})();


//document.querySelector("#daily-info > a")