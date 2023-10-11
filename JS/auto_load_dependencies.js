const dependencies = {
    // Do not use '"rel": "preconnect"'
    "style_css": {
        "rel": "stylesheet",
        "href": "./css/style.css",
        "type": "link"
    },
    "jquery": {
        "src": "https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js",
        "type": "script"
    }
};

function loadElement(dependency) {
    return new Promise((resolve, reject) => {
        if (dependency.type === 'script') {
            const script = document.createElement('script');
            script.src = dependency.src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        } else if (dependency.type === 'link') {
            const link = document.createElement('link');
            link.rel = dependency.rel;
            link.href = dependency.href;
            if (dependency.crossorigin === true) {
                link.crossOrigin = true;
            }
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        }
    });
}

async function loadDependencies() {
    try {
        const promises = [];
        for (const item in dependencies) {
            if (dependencies.hasOwnProperty(item)) {
                const dependency = dependencies[item];
                const promise = loadElement(dependency);
                promises.push(promise);
            }
        }
        await Promise.all(promises);
        console.log('All Dependencies Loaded!');
    } catch (error) {
        console.error('Error loading dependencies:', error);
    }
}

loadDependencies();