import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CategoryGrid extends StatelessWidget {
  final Function(String) onSelect;
  const CategoryGrid({super.key, required this.onSelect});

  @override
  Widget build(BuildContext context) {
    final categories = [
      {'name': 'Compact', 'image': 'assets/images/car-compact.png', 'count': '1,240 cars'},
      {'name': 'Sedan', 'image': 'assets/images/car-sedan.png', 'count': '2,150 cars'},
      {'name': 'SUV', 'image': 'assets/images/car-suv.png', 'count': '1,890 cars'},
      {'name': 'Electric', 'image': 'assets/images/car-electric.png', 'count': '840 cars'},
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 1.1,
        ),
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final cat = categories[index];
          return GestureDetector(
            onTap: () => onSelect(cat['name']!),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE5E7EB)),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Image.asset(cat['image']!, height: 60, fit: BoxFit.contain),
                  const SizedBox(height: 12),
                  Text(
                    cat['name']!,
                    style: GoogleFonts.inter(
                      fontSize: 15,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF1A1A2E),
                    ),
                  ),
                  Text(
                    cat['count']!,
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF9CA3AF),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
