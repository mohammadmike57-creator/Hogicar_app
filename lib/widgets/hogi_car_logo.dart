import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class HogiCarLogo extends StatelessWidget {
  final double height;
  final Color? color;
  final bool showText;

  const HogiCarLogo({
    super.key,
    this.height = 32,
    this.color,
    this.showText = true,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          Icons.directions_car,
          color: color ?? const Color(0xFF123C69),
          size: height * 0.8,
        ),
        if (showText) ...[
          const SizedBox(width: 4),
          Text(
            'HOGI',
            style: GoogleFonts.montserrat(
              fontSize: height * 0.7,
              fontWeight: FontWeight.w900,
              color: color ?? const Color(0xFF123C69),
              letterSpacing: -0.5,
            ),
          ),
          Text(
            'CAR',
            style: GoogleFonts.montserrat(
              fontSize: height * 0.7,
              fontWeight: FontWeight.w400,
              color: color ?? const Color(0xFF123C69),
              letterSpacing: -0.5,
            ),
          ),
        ],
      ],
    );
  }
}
