import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class InsuranceWidget extends StatelessWidget {
  final bool added;
  final VoidCallback onToggle;
  final int pricePerDay;

  const InsuranceWidget({
    super.key,
    required this.added,
    required this.onToggle,
    required this.pricePerDay,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onToggle,
      child: Container(
        margin: const EdgeInsets.all(16),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: added ? const Color(0xFFF0FDF4) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: added ? const Color(0xFF15803D) : const Color(0xFFE5E7EB), width: 1.5),
        ),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: added ? const Color(0xFF15803D) : const Color(0xFF123C69),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.shield_outlined, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Full Protection",
                        style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E)),
                      ),
                      Text(
                        "Zero deductible, windows, mirrors & tires",
                        style: GoogleFonts.inter(fontSize: 13, color: const Color(0xFF6B7280)),
                      ),
                    ],
                  ),
                ),
                Text(
                  "\$$pricePerDay/day",
                  style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: const Color(0xFF123C69)),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Divider(height: 1, color: Color(0xFFE5E7EB)),
            const SizedBox(height: 16),
            Row(
              children: [
                Icon(added ? Icons.check_circle : Icons.add_circle_outline, color: added ? const Color(0xFF15803D) : const Color(0xFF123C69), size: 20),
                const SizedBox(width: 8),
                Text(
                  added ? "Protection Added" : "Add Protection",
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: added ? const Color(0xFF15803D) : const Color(0xFF123C69),
                  ),
                ),
                const Spacer(),
                if (added)
                  const Icon(Icons.verified, color: Color(0xFF15803D), size: 18),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
