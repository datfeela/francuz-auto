document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("message", function (e) {
        try {
            var data = JSON.parse(e.data);
            if (data && data.acatFrameHeight) {
                document.getElementById("acat-frame").style.height = data.acatFrameHeight + "px";
            }
        }
        catch (e) { }
    },
        false);
})

