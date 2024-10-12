'use strict';

var cheerio = require('cheerio');

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var hexoThemeButterfly$1 = {};

/**
 * get author name
 * @param author
 * @returns
 */
function getAuthorName(author) {
    if (typeof author === "string")
        return author;
    if (author && typeof author === "object" && !Array.isArray(author)) {
        if (typeof author.name === "string")
            return author.name;
        if (typeof author.nick === "string")
            return author.nick;
        if (typeof author.nickname === "string")
            return author.nickname;
        if (typeof author.author_obj === "object")
            return getAuthorName(author.author_obj);
    }
}
hexo.extend.helper.register("getAuthorName", function (author, fallback) {
    var resultAuthor = getAuthorName(author);
    if (resultAuthor)
        return resultAuthor;
    var resultFallback = getAuthorName(fallback);
    if (resultFallback)
        return resultFallback;
    return getAuthorName(hexo.config) || "Unknown";
});

// re-implementation fixer of hexo-seo
/**
 * fix SEO on anchors
 * @param $ CherrioAPI
 * @returns
 */
function fixAnchor($, data) {
    $("a").each(function () {
        // avoid duplicate rels
        var currentRel = $(this).attr("rel");
        if (currentRel) {
            // Create a Set to store unique rels
            var rels = new Set(currentRel.split(" "));
            // Update the rel attribute with unique values
            $(this).attr("rel", Array.from(rels).join(" "));
        }
        // add anchor title
        if ($(this).attr("title")) {
            $(this).attr("title", data.title ? "".concat(data.title, " ").concat($(this).attr("href")) : $(this).attr("href"));
        }
    });
    return $;
}
function fixImages($, data) {
    $("img").each(function () {
        var src = $(this).attr("src") || $(this).attr("data-src");
        var alt = $(this).attr("alt") || "";
        if (alt.length === 0) {
            $(this).attr("alt", data.title ? "".concat(data.title, " ").concat(src) : src);
        }
        var title = $(this).attr("title") || "";
        if (title.length === 0) {
            $(this).attr("title", data.title ? "".concat(data.title, " ").concat(src) : src);
        }
        var itemprop = $(this).attr("itemprop");
        if (!itemprop || itemprop.trim() === "") {
            $(this).attr("itemprop", "image");
        }
    });
    return $;
}
/**
 * callback for after_render:html
 * @param content rendered html string
 * @param data current page data
 */
function htmlSeoFixer(content, data) {
    var $ = cheerio.load(content);
    $ = fixAnchor($, data);
    $ = fixImages($, data);
    return $.html();
}
hexo.extend.filter.register("after_render:html", htmlSeoFixer);

var hasRequiredHexoThemeButterfly;

function requireHexoThemeButterfly () {
	if (hasRequiredHexoThemeButterfly) return hexoThemeButterfly$1;
	hasRequiredHexoThemeButterfly = 1;

	return hexoThemeButterfly$1;
}

var hexoThemeButterflyExports = requireHexoThemeButterfly();
var hexoThemeButterfly = /*@__PURE__*/getDefaultExportFromCjs(hexoThemeButterflyExports);

module.exports = hexoThemeButterfly;
