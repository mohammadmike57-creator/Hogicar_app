import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primaryBlue = Color(0xFF123C69);
  static const Color accentBlue = Color(0xFF1565C0);
  static const Color lightBlue = Color(0xFFEEF4FF);
  static const Color background = Color(0xFFF0F4FF);
  static const Color card = Color(0xFFFFFFFF);
  static const Color primaryText = Color(0xFF1A1A2E);
  static const Color secondaryText = Color(0xFF6B7280);
  static const Color mutedText = Color(0xFF9CA3AF);
  static const Color border = Color(0xFFE5E7EB);
  static const Color input = Color(0xFFF3F4F6);
  static const Color success = Color(0xFF15803D);
  static const Color warning = Color(0xFFD97706);
  static const Color error = Color(0xFFEF4444);
  static const Color orange = Color(0xFFF57C00);
  
  // Luxury & Dark Theme Colors
  static const Color primaryDark = Color(0xFF0A1929);
  static const Color luxuryBlue = Color(0xFF1E3A8A);
  static const Color premiumCyan = Color(0xFF06B6D4);
  static const Color secondaryDark = Color(0xFF111827);
  static const Color darkBlue = Color(0xFF0A1929);
  static const Color softWhite = Color(0xFFF9FAFB);
  static const Color mutedSlate = Color(0xFF64748B);

  // Aliases for backward compatibility
  static const Color discoverBlue = primaryBlue;
  static const Color accentOrange = orange;
  static const Color textPrimary = primaryText;
  static const Color textSecondary = secondaryText;
  static const Color backgroundLight = background;
  static const Color surfaceWhite = card;
  static const Color primaryAccent = primaryBlue;
  
  static const double borderRadius = 14.0;

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: background,
      primaryColor: primaryBlue,
      colorScheme: const ColorScheme.light(
        primary: primaryBlue,
        secondary: orange,
        surface: card,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: primaryText,
        outline: border,
        secondaryContainer: lightBlue,
        onSecondaryContainer: accentBlue,
      ),
      textTheme: GoogleFonts.interTextTheme().copyWith(
        displayLarge: GoogleFonts.inter(
          fontSize: 44,
          fontWeight: FontWeight.w700,
          color: primaryText,
          letterSpacing: -1.0,
          height: 1.2,
        ),
        displayMedium: GoogleFonts.inter(
          fontSize: 30,
          fontWeight: FontWeight.w700,
          color: primaryText,
          letterSpacing: -0.5,
          height: 1.2,
        ),
        titleLarge: GoogleFonts.inter(
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: primaryText,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 15,
          color: primaryText,
          fontWeight: FontWeight.w400,
          height: 1.5,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 14,
          color: secondaryText,
          fontWeight: FontWeight.w400,
        ),
        labelSmall: GoogleFonts.inter(
          fontSize: 10,
          fontWeight: FontWeight.w700,
          color: mutedText,
          letterSpacing: 1.5,
        ),
      ),
      appBarTheme: const AppBarThemeData(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: primaryText,
          fontSize: 18,
          fontWeight: FontWeight.w700,
        ),
        iconTheme: IconThemeData(color: primaryText),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primaryBlue,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 56),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(18),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 16,
            fontWeight: FontWeight.w700,
          ),
          elevation: 0,
        ),
      ),
      inputDecorationTheme: InputDecorationThemeData(
        filled: true,
        fillColor: input,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: accentBlue, width: 1),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      cardTheme: CardThemeData(
        color: card,
        elevation: 4,
        shadowColor: accentBlue.withOpacity(0.1),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: primaryDark,
      primaryColor: luxuryBlue,
      colorScheme: const ColorScheme.dark(
        primary: luxuryBlue,
        secondary: premiumCyan,
        surface: secondaryDark,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: softWhite,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme().copyWith(
        displayLarge: GoogleFonts.plusJakartaSans(
          fontSize: 34,
          fontWeight: FontWeight.w800,
          color: softWhite,
          letterSpacing: -0.5,
        ),
        displayMedium: GoogleFonts.plusJakartaSans(
          fontSize: 26,
          fontWeight: FontWeight.w700,
          color: softWhite,
        ),
        titleLarge: GoogleFonts.plusJakartaSans(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: softWhite,
        ),
        bodyLarge: GoogleFonts.plusJakartaSans(
          fontSize: 16,
          color: softWhite,
        ),
        bodyMedium: GoogleFonts.plusJakartaSans(
          fontSize: 14,
          color: mutedSlate,
        ),
      ),
      appBarTheme: const AppBarThemeData(
        backgroundColor: primaryDark,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: softWhite,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
        iconTheme: IconThemeData(color: softWhite),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: luxuryBlue,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 62),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: GoogleFonts.plusJakartaSans(
            fontSize: 17,
            fontWeight: FontWeight.w800,
          ),
          elevation: 0,
        ),
      ),
    );
  }
}
