import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../providers/app_provider.dart';
import 'onboarding_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final topPadding = MediaQuery.of(context).padding.top;
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          children: [
            _buildHeader(context, topPadding),
            _buildStatsRow(),
            _buildLoyaltyCard(),
            _buildMenuSection("Account", [
              _MenuItem(icon: Icons.person_outline, title: "Personal Details"),
              _MenuItem(icon: Icons.payment_outlined, title: "Payment Methods"),
              _MenuItem(icon: Icons.notifications_none, title: "Notifications"),
            ]),
            _buildMenuSection("Preferences", [
              _MenuItem(icon: Icons.language, title: "Language", trailing: "English"),
              _MenuItem(icon: Icons.monetization_on_outlined, title: "Currency", trailing: "USD"),
            ]),
            _buildMenuSection("Support", [
              _MenuItem(icon: Icons.help_outline, title: "Help Center"),
              _MenuItem(icon: Icons.chat_bubble_outline, title: "Contact Us"),
            ]),
            Padding(
              padding: const EdgeInsets.all(20),
              child: ElevatedButton(
                onPressed: () async {
                  final prefs = await SharedPreferences.getInstance();
                  await prefs.remove('@onboarding_done');
                  if (context.mounted) {
                    Navigator.of(context).pushAndRemoveUntil(
                      MaterialPageRoute(builder: (context) => const OnboardingScreen()),
                      (route) => false,
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: const Color(0xFFEF4444),
                  elevation: 0,
                  side: const BorderSide(color: Color(0xFFE5E7EB)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.logout, size: 20),
                    SizedBox(width: 8),
                    Text("Sign Out", style: TextStyle(fontWeight: FontWeight.w600)),
                  ],
                ),
              ),
            ),
            const Text("Version 1.0.0 (24)", style: TextStyle(color: Color(0xFF9CA3AF), fontSize: 12)),
            SizedBox(height: 120 + bottomPadding),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, double topPadding) {
    return Container(
      padding: EdgeInsets.fromLTRB(20, topPadding + 20, 20, 24),
      color: Colors.white,
      child: Row(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: const BoxDecoration(
              color: Color(0xFFEEF4FF),
              shape: BoxShape.circle,
            ),
            child: const Center(child: Icon(Icons.person, size: 32, color: Color(0xFF123C69))),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("John Smith", style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E))),
                Text("john@example.com", style: GoogleFonts.inter(fontSize: 14, color: const Color(0xFF6B7280))),
              ],
            ),
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.edit_outlined, color: Color(0xFF123C69)),
            style: IconButton.styleFrom(backgroundColor: const Color(0xFFF3F4F6)),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsRow() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFF3F4F6)), bottom: BorderSide(color: Color(0xFFF3F4F6))),
      ),
      child: Row(
        children: [
          _buildStatItem("12", "Trips"),
          _buildStatItem("\$2,450", "Spent"),
          _buildStatItem("Gold", "Tier"),
        ],
      ),
    );
  }

  Widget _buildStatItem(String val, String label) {
    return Expanded(
      child: Column(
        children: [
          Text(val, style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E))),
          Text(label, style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF6B7280))),
        ],
      ),
    );
  }

  Widget _buildLoyaltyCard() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF123C69), Color(0xFF1565C0)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: const Color(0xFF123C69).withOpacity(0.3), blurRadius: 12, offset: const Offset(0, 6))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Hogi Rewards", style: GoogleFonts.inter(color: Colors.white.withOpacity(0.8), fontSize: 13, fontWeight: FontWeight.w500)),
              const Icon(Icons.stars, color: Color(0xFFFFD100), size: 24),
            ],
          ),
          const SizedBox(height: 12),
          Text("2,450 Points", style: GoogleFonts.inter(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w700)),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Gold Member", style: GoogleFonts.inter(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w600)),
              Text("550 to Platinum", style: GoogleFonts.inter(color: Colors.white.withOpacity(0.8), fontSize: 11)),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: 0.7,
              backgroundColor: Colors.white.withOpacity(0.2),
              valueColor: const AlwaysStoppedAnimation(Colors.white),
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuSection(String title, List<_MenuItem> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 24, 20, 12),
          child: Text(title, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: const Color(0xFF9CA3AF), letterSpacing: 1.2)),
        ),
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
          child: Column(
            children: items.asMap().entries.map((entry) {
              final idx = entry.key;
              final item = entry.value;
              return Column(
                children: [
                  ListTile(
                    leading: Icon(item.icon, size: 22, color: const Color(0xFF1A1A2E)),
                    title: Text(item.title, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w500, color: const Color(0xFF1A1A2E))),
                    trailing: item.trailing != null 
                      ? Text(item.trailing!, style: GoogleFonts.inter(color: const Color(0xFF6B7280), fontSize: 14))
                      : const Icon(Icons.chevron_right, size: 20, color: Color(0xFFD1D5DB)),
                    onTap: () {},
                  ),
                  if (idx < items.length - 1) const Divider(height: 1, indent: 56, color: Color(0xFFF3F4F6)),
                ],
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}

class _MenuItem {
  final IconData icon;
  final String title;
  final String? trailing;
  _MenuItem({required this.icon, required this.title, this.trailing});
}
