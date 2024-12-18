function findCombinationsFromText(text) {
    const HIERARCHY = {
        'Group': 1,
        'Category': 2,
        'Subcategory': 3,
        'Make': 4,
        'Model': 5,
        'Diagram': 6
    };

    if (!text) return [];

    const cleanText = text
        .replace(/^[^a-zA-Z0-9_]+/, '')
        .replace(/[^a-zA-Z0-9_]+$/, '')
        .replace(/[^a-zA-Z0-9_\-,\s]/g, '')
        .replace(/\s+/g, '')
        .replace(/-+/g, '-');

    // Remove edge case
    if (!cleanText.includes(',')) {
        const parts = cleanText.split('-');
        const tagParts = parts.filter(part => part.includes('_'));
        
        if (tagParts.length === 2) {
            const firstTagIndex = parts.indexOf(tagParts[0]);
            const secondTagIndex = parts.indexOf(tagParts[1]);

            const inBetween = parts.slice(firstTagIndex + 1, secondTagIndex);

            let firstTagNamePart = tagParts[0].split('_')[1] || '';
            if (inBetween.length) {
                firstTagNamePart += '-' + inBetween.join('-');
            }

            const hyphenCount = (firstTagNamePart.match(/-/g) || []).length;
            if (hyphenCount > 2) {
                return [[cleanText]];
            }
        }
    }

    // Normal parsing continues below
    const parts = cleanText.split(/[,\-]/).map(part => part.trim()).filter(Boolean);

    const allTags = [];
    let currentTag = '';

    parts.forEach(part => {
        if (part.includes('_')) {
            if (currentTag) {
                allTags.push(currentTag);
            }
            currentTag = part;
        } else if (currentTag) {
            currentTag += '-' + part;
        }
    });

    if (currentTag) {
        allTags.push(currentTag);
    }

    const prefixCount = {};
    allTags.forEach(tag => {
        const prefix = tag.split('_')[0];
        prefixCount[prefix] = (prefixCount[prefix] || 0) + 1;
    });

    for (const prefix in prefixCount) {
        // Disallow duplicate prefixes
        if (prefixCount[prefix] > 1) {
            return [];
        }
    }

    // Filter out tags whose prefix is not in HIERARCHY
    let tags = allTags.filter(tag => {
        const prefix = tag.split('_')[0];
        return HIERARCHY.hasOwnProperty(prefix);
    });

    if (tags.length === 0 || tags.length !== allTags.length) {
        return [];
    }

    // Sort tags by hierarchy
    tags.sort((a, b) => {
        const aType = a.split('_')[0];
        const bType = b.split('_')[0];
        return HIERARCHY[aType] - HIERARCHY[bType];
    });

    // Build combinations: [full list, minus last one, minus last two, ...]
    const result = [];
    for (let i = tags.length; i > 0; i--) {
        result.push(tags.slice(0, i));
    }

    return result;
}

module.exports = { findCombinationsFromText };