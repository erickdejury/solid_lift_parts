const { findCombinationsFromText } = require('./main');

describe('findCombinationsFromText', () => {
    test('Case 1: Should handle basic group and make combination', () => {
        const input = 'Group_Electric-Pallet-Jack-Parts-Make_BT-Prime-Mover';
        const result = findCombinationsFromText(input);
        
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(['Group_Electric-Pallet-Jack-Parts-Make_BT-Prime-Mover']);
    });

    test('Case 2: Should handle group, category, and subcategory combination', () => {
        const input = 'Group_Electric-Pallet-Jack-Parts, Category_Switches, Subcategory_Ignition-Switch';
        const result = findCombinationsFromText(input);
        
        expect(result).toHaveLength(3);
        expect(result[0]).toEqual([
            'Group_Electric-Pallet-Jack-Parts',
            'Category_Switches',
            'Subcategory_Ignition-Switch'
        ]);
        expect(result[1]).toEqual([
            'Group_Electric-Pallet-Jack-Parts',
            'Category_Switches'
        ]);
        expect(result[2]).toEqual(['Group_Electric-Pallet-Jack-Parts']);
    });

    test('Case 3: Should handle input with invalid characters', () => {
        const input = '--Group_Electric-Pallet-Jack-Parts, Category_Switche@%s-!! Subcategory_Ignition-Switch))@!%';
        const result = findCombinationsFromText(input);
        
        expect(result).toHaveLength(3);
        expect(result[0]).toEqual([
            'Group_Electric-Pallet-Jack-Parts',
            'Category_Switches',
            'Subcategory_Ignition-Switch'
        ]);
        expect(result[1]).toEqual([
            'Group_Electric-Pallet-Jack-Parts',
            'Category_Switches'
        ]);
        expect(result[2]).toEqual(['Group_Electric-Pallet-Jack-Parts']);
    });

    test('Should handle empty string', () => {
        const result = findCombinationsFromText('');
        expect(result).toHaveLength(0);
    });

    test('Should handle single tag', () => {
        const result = findCombinationsFromText('Group_A');
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(['Group_A']);
    });

    test('Should handle string with only invalid characters', () => {
        const result = findCombinationsFromText('@#$%^&*()');
        expect(result).toHaveLength(0);
    });

    test('Should handle multiple commas and spaces', () => {
        const result = findCombinationsFromText('Group_A,,,  Category_B,    Subcategory_C');
        expect(result).toHaveLength(3);
        expect(result[0]).toEqual(['Group_A', 'Category_B', 'Subcategory_C']);
    });

    test('Case 5: Should handle incorrect tag order', () => {
        const input = 'Category_Switches-Group_Electric-Pallet-Jack-Parts-Subcategory_Ignition-Switch';
        const result = findCombinationsFromText(input);
        
        expect(result[0]).toEqual([
            'Group_Electric-Pallet-Jack-Parts',
            'Category_Switches',
            'Subcategory_Ignition-Switch'
        ]);
    });

    test('Case 6: Should handle Make without Subcategory', () => {
        const input = 'Group_Tools-Hardware-Category_Roll-Pin-Make_Atlas';
        const result = findCombinationsFromText(input);
        
        expect(result[0]).toEqual([
            'Group_Tools-Hardware',
            'Category_Roll-Pin',
            'Make_Atlas'
        ]);
    });

    test('Case 7: Should handle duplicate prefixes', () => {
        const input = 'Group_Tools-Hardware-Category_Roll-Pin-Make_Atlas-Group_Test';
        const result = findCombinationsFromText(input);
        expect(result).toHaveLength(0);
    });

    test('Case 8: Should handle invalid prefix', () => {
        const input = 'Group_Tools-Hardware-Category_Roll-Pin-Make_Atlas-WrongPrefix_Test';
        const result = findCombinationsFromText(input);
        expect(result).toHaveLength(0);
    });

    test('Should handle double hyphens correctly', () => {
        const input = '--Group_A--Category_B';
        const result = findCombinationsFromText(input);
        expect(result[0]).toEqual(['Group_A', 'Category_B']);
    });

    test('Case 9: Should handle group through model hierarchy', () => {
        const input = 'Group_Tools-Hardware-Category_Roll-Pin-Make_U-Line-Model_H-1193';
        const result = findCombinationsFromText(input);
        
        expect(result).toHaveLength(4);
        expect(result[0]).toEqual([
            'Group_Tools-Hardware',
            'Category_Roll-Pin',
            'Make_U-Line',
            'Model_H-1193'
        ]);
        expect(result[1]).toEqual([
            'Group_Tools-Hardware',
            'Category_Roll-Pin',
            'Make_U-Line'
        ]);
        expect(result[2]).toEqual([
            'Group_Tools-Hardware',
            'Category_Roll-Pin'
        ]);
        expect(result[3]).toEqual(['Group_Tools-Hardware']);
    });

    test('Case 10: Should handle group through model without model value', () => {
        const input = 'Group_Tools-Hardware-Category_Roll-Pin-Make_Multiton-Model_J';
        const result = findCombinationsFromText(input);
        
        expect(result).toHaveLength(4);
        expect(result[0]).toEqual([
            'Group_Tools-Hardware',
            'Category_Roll-Pin',
            'Make_Multiton',
            'Model_J'
        ]);
        expect(result[1]).toEqual([
            'Group_Tools-Hardware',
            'Category_Roll-Pin',
            'Make_Multiton'
        ]);
        expect(result[2]).toEqual([
            'Group_Tools-Hardware',
            'Category_Roll-Pin'
        ]);
        expect(result[3]).toEqual(['Group_Tools-Hardware']);
    });

    test('Case 11: Should handle make through diagram', () => {
        const input = 'Make_Atlas-Model_Zenith-Type9-Diagram_Frame';
        const result = findCombinationsFromText(input);
        
        expect(result).toHaveLength(3);
        expect(result[0]).toEqual([
            'Make_Atlas',
            'Model_Zenith-Type9',
            'Diagram_Frame'
        ]);
        expect(result[1]).toEqual([
            'Make_Atlas',
            'Model_Zenith-Type9'
        ]);
        expect(result[2]).toEqual(['Make_Atlas']);
    });

    test('Case 12: Should handle ampersand in tag', () => {
        const input = 'Group_Tools-&-Hardware';
        const result = findCombinationsFromText(input);
        
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual(['Group_Tools-Hardware']);
    });

    test('Case 13: Should handle full hierarchy with model', () => {
        const input = 'Group_Electric-Pallet-Jack-Parts-Category_Battery-Subcategory_Battery-Charger-Make_Hyster-Model_B218N26949L-UP';
        const result = findCombinationsFromText(input);
        
        expect(result).toHaveLength(5);
        expect(result[0]).toEqual([
            'Group_Electric-Pallet-Jack-Parts',
            'Category_Battery',
            'Subcategory_Battery-Charger',
            'Make_Hyster',
            'Model_B218N26949L-UP'
        ]);
        expect(result[1]).toEqual([
            'Group_Electric-Pallet-Jack-Parts',
            'Category_Battery',
            'Subcategory_Battery-Charger',
            'Make_Hyster'
        ]);
        expect(result[2]).toEqual([
            'Group_Electric-Pallet-Jack-Parts',
            'Category_Battery',
            'Subcategory_Battery-Charger'
        ]);
        expect(result[3]).toEqual([
            'Group_Electric-Pallet-Jack-Parts',
            'Category_Battery'
        ]);
        expect(result[4]).toEqual(['Group_Electric-Pallet-Jack-Parts']);
    });

    test('Case 14: Should handle category with hyphens', () => {
        const input = 'Group_Electric-Pallet-Jack-Parts-Category_Electric-Pallet-Jack-Lift-Parts-Subcategory_Yoke';
        const result = findCombinationsFromText(input);
        
        expect(result).toHaveLength(3);
        expect(result[0]).toEqual([
            'Group_Electric-Pallet-Jack-Parts',
            'Category_Electric-Pallet-Jack-Lift-Parts',
            'Subcategory_Yoke'
        ]);
        expect(result[1]).toEqual([
            'Group_Electric-Pallet-Jack-Parts',
            'Category_Electric-Pallet-Jack-Lift-Parts'
        ]);
        expect(result[2]).toEqual(['Group_Electric-Pallet-Jack-Parts']);
    });

    test('Case 15: Should handle group and make only', () => {
        const input = 'Group_Industrial-Seal-Kits-Make_Yutani';
        const result = findCombinationsFromText(input);
        
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual([
            'Group_Industrial-Seal-Kits',
            'Make_Yutani'
        ]);
        expect(result[1]).toEqual(['Group_Industrial-Seal-Kits']);
    });

    test('Case 16: Should handle make and model only', () => {
        const input = 'Make_Atlas-Model_Zenith-Type9';
        const result = findCombinationsFromText(input);
        
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual([
            'Make_Atlas',
            'Model_Zenith-Type9'
        ]);
        expect(result[1]).toEqual(['Make_Atlas']);
    });

    test('Case 17: Should handle group and category only', () => {
        const input = 'Group_Wheel-Bearings-Category_Bearing-Wiper';
        const result = findCombinationsFromText(input);
        
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual([
            'Group_Wheel-Bearings',
            'Category_Bearing-Wiper'
        ]);
        expect(result[1]).toEqual(['Group_Wheel-Bearings']);
    });
}); 