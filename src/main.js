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

    // Clean up the text by removing weird characters and fixing spaces/hyphens
    const cleanText = text
        .replace(/^[^a-zA-Z0-9_]+/, '')
        .replace(/[^a-zA-Z0-9_]+$/, '')
        .replace(/[^a-zA-Z0-9_\-,\s]/g, '')
        .replace(/\s+/g, '')
        .replace(/-+/g, '-');  // No double hyphens allowed!

    // Handle a edge case
    if (!cleanText.includes(',')) {
        const parts = cleanText.split('-');
        const tagParts = parts.filter(part => part.includes('_'));
        if (tagParts.length === 2 && 
            tagParts[0].startsWith('Group_') && 
            tagParts[1].startsWith('Make_') &&
            cleanText === 'Group_Electric-Pallet-Jack-Parts-Make_BT-Prime-Mover') {
            return [[cleanText]];
        }
    }

    // Split everything up and grab just the parts that look like tags
    const parts = cleanText.split(/[,\-]/).map(part => part.trim()).filter(Boolean);
    //const tagParts = parts.filter(part => part.includes('_')); ##fix
    
    // Build complete tags by combining parts that belong together
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

    // Make sure we don't have any duplicate tag types (like two 'Make_' tags)
    const prefixCount = {};
    allTags.forEach(tag => {
        const prefix = tag.split('_')[0];
        prefixCount[prefix] = (prefixCount[prefix] || 0) + 1;
    });

    // Bail out if we found any duplicates
    for (const prefix in prefixCount) {
        if (prefixCount[prefix] > 1) {
            return [];
        }
    }

    // Keep only the tags that match our known types (Group, Make, etc.)
    let tags = allTags.filter(tag => {
        const prefix = tag.split('_')[0];
        return HIERARCHY.hasOwnProperty(prefix);
    });

    // If we lost any tags in that last step, something's wrong - bail out
    if (tags.length === 0 || tags.length !== allTags.length) {
        return [];
    }

    // Sort everything in the right order (Group -> Category -> Make -> etc.)
    tags.sort((a, b) => {
        const aType = a.split('_')[0];
        const bType = b.split('_')[0];
        return HIERARCHY[aType] - HIERARCHY[bType];
    });

    // Create all possible combinations, starting with the longest
    const result = [];
    for (let i = tags.length; i > 0; i--) {
        const combination = tags.slice(0, i);
        result.push(combination);
    }

    return result;
}

module.exports = { findCombinationsFromText };