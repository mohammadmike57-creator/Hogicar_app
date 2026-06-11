import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../theme/app_theme.dart';
import '../providers/app_provider.dart';
import '../services/api_service.dart';
import 'search_results_screen.dart';

class SearchingScreen extends StatefulWidget {
  const SearchingScreen({super.key});

  @override
  State<SearchingScreen> createState() => _SearchingScreenState();
}

class _SearchingScreenState extends State<SearchingScreen> {
  final ApiService _apiService = ApiService();
  int _messageIndex = 0;
  List<dynamic> _realSuppliers = [];
  int _duration = 5000;
  final List<String> _messages = [
    'Comparing prices...',
    'Checking supplier inventory...',
    'Finding free cancellation deals...',
    'Checking special offers...',
    'Finding best value cars...',
    'Almost done...',
  ];

  final List<String> _suppliers = [
    'Avis', 'Hertz', 'Enterprise', 'Alamo', 'Europcar', 'National',
    'Budget', 'Sixt', 'Thrifty', 'Dollar', 'Keddy', 'Green Motion'
  ];

  @override
  void initState() {
    super.initState();
    _loadSettingsAndLogos();
    _startMessageRotation();
  }

  Future<void> _loadSettingsAndLogos() async {
    final provider = context.read<AppProvider>();
    try {
      final settings = await _apiService.fetchSiteSettings();
      if (mounted) {
        setState(() {
          _duration = settings['searchingScreenDuration'] ?? 5000;
        });
      }

      final logos = await _apiService.fetchSearchingLogos(provider.pickupCode);
      if (mounted) {
        setState(() {
          _realSuppliers = logos;
        });
      }
    } catch (e) {
      debugPrint('Error loading searching settings: $e');
    }
    
    _navigateToResults();
  }

  void _startMessageRotation() async {
    while (mounted) {
      await Future.delayed(const Duration(milliseconds: 2000));
      if (!mounted) return;
      setState(() {
        _messageIndex = (_messageIndex + 1) % _messages.length;
      });
    }
  }

  void _navigateToResults() async {
    await Future.delayed(Duration(milliseconds: _duration));
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (context) => const SearchResultsScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.read<AppProvider>();
    
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        automaticallyImplyLeading: false,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              provider.pickupLocation == provider.dropoffLocation || provider.dropoffLocation.isEmpty
                  ? provider.pickupLocation
                  : '${provider.pickupLocation} → ${provider.dropoffLocation}',
              style: const TextStyle(color: Color(0xFF1A1A2E), fontSize: 14, fontWeight: FontWeight.w600),
            ),
            Text(
              '${provider.pickupDate != null ? DateFormat('dd MMM').format(provider.pickupDate!) : ""} - ${provider.returnDate != null ? DateFormat('dd MMM').format(provider.returnDate!) : ""}',
              style: const TextStyle(color: Color(0xFF6B7280), fontSize: 12),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Edit', style: TextStyle(color: Color(0xFF123C69), fontWeight: FontWeight.bold)),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Searching for the best deals...',
                    style: GoogleFonts.inter(
                      color: const Color(0xFF1A1A2E),
                      fontSize: 32,
                      fontWeight: FontWeight.w700,
                      height: 1.1,
                    ),
                  ).animate().fadeIn(duration: 300.ms),
                  const SizedBox(height: 10),
                  Text(
                    'Comparing 1000+ leading suppliers in seconds',
                    style: GoogleFonts.inter(color: const Color(0xFF6B7280), fontSize: 16),
                  ).animate().fadeIn(delay: 200.ms, duration: 300.ms),
                ],
              ),
            ),

            // Supplier Grid
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 4,
                  mainAxisSpacing: 16,
                  crossAxisSpacing: 16,
                  childAspectRatio: 2,
                ),
                itemCount: _realSuppliers.isNotEmpty ? _realSuppliers.length : _suppliers.length,
                itemBuilder: (context, index) {
                  if (_realSuppliers.isNotEmpty) {
                    final supplier = _realSuppliers[index];
                    return Container(
                      padding: const EdgeInsets.all(4),
                      decoration: BoxDecoration(
                        border: Border.all(color: AppTheme.border),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: supplier['logoUrl'] != null
                        ? Image.network(supplier['logoUrl'], fit: BoxFit.contain)
                        : Center(child: Text(supplier['name'] ?? '', style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold))),
                    ).animate().fadeIn(delay: (100 * index).ms, duration: 200.ms);
                  }

                  return Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: AppTheme.border),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Center(
                      child: Text(
                        _suppliers[index],
                        style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: AppTheme.secondaryText),
                      ),
                    ),
                  ).animate().fadeIn(delay: (100 * index).ms, duration: 200.ms);
                },
              ),
            ),

            const SizedBox(height: 32),
            
            // Progress message
            Center(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: Text(
                  _messages[_messageIndex],
                  key: ValueKey(_messages[_messageIndex]),
                  style: GoogleFonts.inter(color: const Color(0xFF123C69), fontWeight: FontWeight.w600, fontSize: 16),
                ),
              ),
            ),

            const SizedBox(height: 32),

            // Skeleton Cards
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: 6,
              itemBuilder: (context, index) {
                return _buildSkeletonCard();
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSkeletonCard() {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppTheme.border.withOpacity(0.5)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Car Image Placeholder
              Container(
                width: 140,
                height: 80,
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              const SizedBox(width: 16),
              // Car Info Placeholder
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(height: 16, width: 150, decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(4))),
                    const SizedBox(height: 8),
                    Container(height: 12, width: 100, decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(4))),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Container(height: 10, width: 40, decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(2))),
                        const SizedBox(width: 8),
                        Container(height: 10, width: 40, decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(2))),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          const Divider(height: 1),
          const SizedBox(height: 16),
          // Price and Button Placeholder
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(height: 10, width: 50, decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(2))),
                  const SizedBox(height: 4),
                  Container(height: 20, width: 80, decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(4))),
                ],
              ),
              Container(
                height: 44,
                width: 120,
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(22),
                ),
              ),
            ],
          ),
        ],
      ),
    ).animate(onPlay: (controller) => controller.repeat())
     .shimmer(duration: 1500.ms, color: Colors.grey.shade50.withOpacity(0.5));
  }
}
