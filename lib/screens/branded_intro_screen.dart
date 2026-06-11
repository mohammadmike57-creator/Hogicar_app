import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../theme/app_theme.dart';
import '../widgets/hogi_car_logo.dart';
import '../providers/app_provider.dart';
import 'main_screen.dart';
import 'onboarding_screen.dart';

class BrandedIntroScreen extends StatefulWidget {
  const BrandedIntroScreen({super.key});

  @override
  State<BrandedIntroScreen> createState() => _BrandedIntroScreenState();
}

class _BrandedIntroScreenState extends State<BrandedIntroScreen> {
  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  void _initializeApp() {
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      // Start initialization
      context.read<AppProvider>().initialize();
      
      final prefs = await SharedPreferences.getInstance();
      final onboardingDone = prefs.getBool('@onboarding_done') ?? false;

      // Wait for the animation duration
      await Future.delayed(const Duration(milliseconds: 2500));
      if (!mounted) return;
      
      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (context, animation, secondaryAnimation) => 
            onboardingDone ? const MainScreen() : const OnboardingScreen(),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return FadeTransition(opacity: animation, child: child);
          },
          transitionDuration: const Duration(milliseconds: 600),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppTheme.lightBlue,
              AppTheme.primaryBlue,
            ],
          ),
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Animated Logo Container
              SizedBox(
                height: 120,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    // The Icon Part (Circle + Roofline)
                    const Hero(
                      tag: 'hogi_car_logo_icon',
                      child: HogiCarLogo(
                        height: 80,
                        isWhite: true,
                        showText: false,
                      ),
                    )
                        .animate()
                        .fadeIn(delay: 400.ms, duration: 600.ms)
                        .scale(
                          begin: const Offset(0.5, 0.5),
                          end: const Offset(1.0, 1.0),
                          duration: 800.ms,
                          curve: Curves.elasticOut,
                        )
                        .shimmer(
                          delay: 1500.ms,
                          duration: 1000.ms,
                          color: Colors.white.withOpacity(0.3),
                        ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              // The Text Part
              const HogiCarLogo(
                height: 40,
                isWhite: true,
                showIcon: false,
              )
                  .animate()
                  .fadeIn(delay: 1100.ms, duration: 600.ms)
                  .slideY(begin: 0.5, end: 0, delay: 1100.ms, duration: 600.ms, curve: Curves.easeOutCubic),
              
              const SizedBox(height: 24),
              // Tagline
              Text(
                'Compare. Book. Drive.',
                style: GoogleFonts.montserrat(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.white.withOpacity(0.9),
                  letterSpacing: 1.2,
                ),
              )
                  .animate()
                  .fadeIn(delay: 1600.ms, duration: 600.ms)
                  .scale(begin: const Offset(0.95, 0.95), end: const Offset(1.0, 1.0), delay: 1600.ms, duration: 600.ms),
            ],
          ),
        ),
      ),
    ).animate().fadeIn(duration: 400.ms);
  }
}
