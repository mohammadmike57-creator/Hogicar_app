import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../widgets/hogi_car_logo.dart';
import 'main_screen.dart';

class OnboardingSlide {
  final int id;
  final List<Color> gradient;
  final String tag;
  final String headline;
  final String sub;
  final String image;
  final Color glow;

  OnboardingSlide({
    required this.id,
    required this.gradient,
    required this.tag,
    required this.headline,
    required this.sub,
    required this.image,
    required this.glow,
  });
}

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> with TickerProviderStateMixin {
  final List<OnboardingSlide> slides = [
    OnboardingSlide(
      id: 0,
      gradient: [const Color(0xFF060E1C), const Color(0xFF0C1E3A), const Color(0xFF123C69)],
      tag: "PREMIUM FLEET",
      headline: "Find Your\nPerfect Car",
      sub: "Search over 10,000 vehicles from the world's top rental suppliers in seconds.",
      image: "assets/images/avis.svg",
      glow: const Color(0xFF1565C0),
    ),
    OnboardingSlide(
      id: 1,
      gradient: [const Color(0xFF08100A), const Color(0xFF0C1E10), const Color(0xFF0D3320)],
      tag: "BEST PRICES",
      headline: "No Hidden\nFees. Ever.",
      sub: "Full price transparency from search to checkout. Compare 500+ suppliers and save up to 40%.",
      image: "assets/images/hertz.svg",
      glow: const Color(0xFF00A86B),
    ),
    OnboardingSlide(
      id: 2,
      gradient: [const Color(0xFF10060A), const Color(0xFF1E0C14), const Color(0xFF3D0F1F)],
      tag: "INSTANT BOOKING",
      headline: "Booked in Under\n2 Minutes",
      sub: "Secure checkout, instant confirmation, and 24/7 expert support wherever you are.",
      image: "assets/images/sixt.svg",
      glow: const Color(0xFFF57C00),
    ),
  ];

  int _currentIndex = 0;
  late List<AnimationController> _progressControllers;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _progressControllers = List.generate(
      slides.length,
      (index) => AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 2200),
      ),
    );
    _startOnboarding();
  }

  void _startOnboarding() async {
    for (int i = 0; i < slides.length; i++) {
      if (!mounted) return;
      setState(() => _currentIndex = i);
      await _progressControllers[i].forward();
      if (i == slides.length - 1) {
        _finishOnboarding();
      }
    }
  }

  void _finishOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('@onboarding_done', true);
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => const MainScreen(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
        transitionDuration: const Duration(milliseconds: 800),
      ),
    );
  }

  @override
  void dispose() {
    for (var controller in _progressControllers) {
      controller.dispose();
    }
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final slide = slides[_currentIndex];
    final size = MediaQuery.of(context).size;
    final topPadding = MediaQuery.of(context).padding.top;
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: const Alignment(0.2, 0),
            end: const Alignment(0.8, 1),
            colors: slide.gradient,
          ),
        ),
        child: Stack(
          children: [
            // Glow effect
            Positioned(
              top: size.height * 0.25,
              left: -size.width * 0.1,
              child: Container(
                width: size.width * 1.2,
                height: size.width * 1.2,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: slide.glow.withOpacity(0.15),
                      blurRadius: 80,
                      spreadRadius: 20,
                    ),
                  ],
                ),
              ),
            ),

            // Main Content
            Column(
              children: [
                SizedBox(height: topPadding + 12),
                // Logo
                const Center(
                  child: HogiCarLogo(
                    height: 24,
                    isWhite: true,
                    showIcon: true,
                    showText: true,
                  ),
                ),
                const SizedBox(height: 20),
                // Progress Bars
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Row(
                    children: List.generate(slides.length, (index) {
                      return Expanded(
                        child: Container(
                          height: 3,
                          margin: const EdgeInsets.symmetric(horizontal: 2),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.22),
                            borderRadius: BorderRadius.circular(2),
                          ),
                          child: index < _currentIndex
                              ? Container(
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(2),
                                  ),
                                )
                              : index == _currentIndex
                                  ? AnimatedBuilder(
                                      animation: _progressControllers[index],
                                      builder: (context, child) {
                                        return FractionallySizedBox(
                                          alignment: Alignment.centerLeft,
                                          widthFactor: _progressControllers[index].value,
                                          child: Container(
                                            decoration: BoxDecoration(
                                              color: Colors.white,
                                              borderRadius: BorderRadius.circular(2),
                                            ),
                                          ),
                                        );
                                      },
                                    )
                                  : const SizedBox.shrink(),
                        ),
                      );
                    }),
                  ),
                ),

                // Car Image
                Expanded(
                  child: Center(
                    child: AnimatedSwitcher(
                      duration: const Duration(milliseconds: 350),
                      child: SvgPicture.asset(
                        slide.image,
                        key: ValueKey(slide.id),
                        width: size.width * 0.88,
                        height: size.height * 0.28,
                        fit: BoxFit.contain,
                      )
                          .animate(onPlay: (controller) => controller.repeat(reverse: true))
                          .moveY(begin: 0, end: -14, duration: 2600.ms, curve: Curves.easeInOutSine),
                    ),
                  ),
                ),

                // Text Content
                Padding(
                  padding: EdgeInsets.fromLTRB(28, 8, 28, bottomPadding + 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Tag
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: slide.glow.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: slide.glow.withOpacity(0.4)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 6,
                              height: 6,
                              decoration: BoxDecoration(
                                color: slide.glow,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 7),
                            Text(
                              slide.tag,
                              style: GoogleFonts.inter(
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                color: slide.glow == const Color(0xFFF57C00) ? const Color(0xFFF57C00) : Colors.white,
                                letterSpacing: 2.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      // Headline
                      Text(
                        slide.headline,
                        style: GoogleFonts.inter(
                          fontSize: 44,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                          height: 1.18,
                          letterSpacing: -1,
                        ),
                      ),
                      const SizedBox(height: 14),
                      // Accent line
                      Container(
                        width: 40,
                        height: 4,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF57C00),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      const SizedBox(height: 14),
                      // Subtext
                      Text(
                        slide.sub,
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w400,
                          color: Colors.white.withOpacity(0.65),
                          height: 1.6,
                        ),
                      ),
                      const SizedBox(height: 20),
                      // Counter
                      Text(
                        '${_currentIndex + 1} / ${slides.length}',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                          color: Colors.white.withOpacity(0.35),
                          letterSpacing: 1,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
