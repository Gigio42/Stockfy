import { toggleDropzoneVisibility } from './toggleDropzone.js';

export function lerTextoPdf(arquivoUrl) {
    pdfjsLib.getDocument(arquivoUrl).promise.then(function (pdf) {
        var textoCompleto = "";
        var numPages = pdf.numPages;

        var leituraPaginaPromessas = [];
        for (var i = 1; i <= numPages; i++) {
            leituraPaginaPromessas.push(
                pdf.getPage(i).then(function (page) {
                    return page.getTextContent().then(function (textContent) {
                        var textoPagina = textContent.items
                            .map(function (s) {
                                return s.str;
                            })
                            .join(" ");
                        textoCompleto += textoPagina;
                    });
                })
            );
        }

        Promise.all(leituraPaginaPromessas).then(function () {
            textoCompleto = textoCompleto.toUpperCase();

            if (textoCompleto.includes("PENHA") || textoCompleto.includes("IRANI")) {
                carregarScript("penha-irani.js", arquivoUrl);
            } else if (textoCompleto.includes("FERNANDEZ")) {
                carregarScript("fernandez.js", arquivoUrl);
            } else {
                $("#errorMessage").text("Esse pedido de compra não corresponde a nenhum fornecedor conhecido.");
                $("#errorModal").show();
            }
        });
    });
}

export function carregarScript(url, arquivoUrl) {
    const existingScript = document.querySelector("script[data-fornecedor]");
    if (existingScript) {
        existingScript.parentNode.removeChild(existingScript);
    }

    const script = document.createElement("script");
    script.onload = function () {
        console.log("Script carregado:", url);
        if (typeof window.handleFile === "function") {
            window.handleFile(arquivoUrl);
        } else {
            console.error("handleFile não está definido.");
        }
    };
    script.src = url;
    script.setAttribute("data-fornecedor", "");
    script.type = "module";
    document.head.appendChild(script);
}
