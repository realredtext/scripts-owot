function(bgImage) {
    state.background = {
        path: bgImage
    };

    loadBackgroundData(() => {
        w.redraw();
    }, () => {
        w.redraw();
    });
};
