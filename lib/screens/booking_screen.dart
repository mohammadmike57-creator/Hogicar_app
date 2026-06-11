import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/car.dart';
import '../providers/app_provider.dart';
import '../widgets/step_indicator.dart';
import 'confirmed_screen.dart';

class BookingScreen extends StatefulWidget {
  final Car car;
  const BookingScreen({super.key, required this.car});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  int _step = 0;
  final _formKey = GlobalKey<FormState>();
  
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _flightController = TextEditingController();
  
  final _cardController = TextEditingController();
  final _expiryController = TextEditingController();
  final _cvvController = TextEditingController();
  final _cardNameController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _flightController.dispose();
    _cardController.dispose();
    _expiryController.dispose();
    _cvvController.dispose();
    _cardNameController.dispose();
    super.dispose();
  }

  void _handleNext() {
    if (_step == 0) {
      if (_formKey.currentState!.validate()) {
        setState(() => _step = 1);
      }
    } else {
      if (_formKey.currentState!.validate()) {
        _finishBooking();
      }
    }
  }

  void _finishBooking() {
    final ref = "CR${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}";
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => ConfirmedScreen(
          bookingRef: ref,
          car: widget.car,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();
    final bottomPadding = MediaQuery.of(context).padding.bottom;
    
    final days = provider.returnDate?.difference(provider.pickupDate ?? DateTime.now()).inDays.clamp(1, 999) ?? 1;
    final insuranceTotal = provider.extraInsurancePrice * days;
    final baseTotal = widget.car.pricePerDay * days;
    final taxes = (baseTotal * 0.12).round();
    final grandTotal = (baseTotal + insuranceTotal + taxes).round();

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FB),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF1A1A2E)),
          onPressed: () {
            if (_step > 0) setState(() => _step = 0);
            else Navigator.pop(context);
          },
        ),
        title: Text("Checkout", style: GoogleFonts.inter(color: const Color(0xFF1A1A2E), fontWeight: FontWeight.w700, fontSize: 18)),
      ),
      body: Column(
        children: [
          StepIndicator(currentStep: _step),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.only(bottom: 100),
              physics: const BouncingScrollPhysics(),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    _buildSummaryCard(baseTotal.round(), insuranceTotal.round(), taxes, grandTotal, days),
                    if (_step == 0) _buildDriverForm() else _buildPaymentForm(),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      bottomSheet: Container(
        padding: EdgeInsets.fromLTRB(16, 12, 16, bottomPadding + 16),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: const Color(0xFFE5E7EB))),
        ),
        child: ElevatedButton(
          onPressed: _handleNext,
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF123C69),
            padding: const EdgeInsets.symmetric(vertical: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.lock_outline, size: 18),
              const SizedBox(width: 8),
              Text(
                _step == 0 ? "Continue to Payment" : "Confirm & Pay \$$grandTotal",
                style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryCard(int base, int insurance, int taxes, int total, int days) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)]),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(widget.car.name, style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
                  Text("${widget.car.rentalCompany} · ${widget.car.type}", style: GoogleFonts.inter(fontSize: 13, color: const Color(0xFF6B7280))),
                ],
              ),
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(color: const Color(0xFF123C69).withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
                child: Center(child: Text("HC", style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: const Color(0xFF123C69)))),
              ),
            ],
          ),
          const Divider(height: 24, color: Color(0xFFF3F4F6)),
          _buildPriceRow("Base Rental", "\$$base"),
          if (insurance > 0) _buildPriceRow("Full Coverage ($days days)", "\$$insurance"),
          _buildPriceRow("Local Taxes (12%)", "\$$taxes"),
          const Divider(height: 24, color: Color(0xFFF3F4F6)),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Total Due Now", style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
              Text("\$$total", style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E))),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildPriceRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: GoogleFonts.inter(fontSize: 13, color: const Color(0xFF6B7280))),
          Text(value, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: const Color(0xFF1A1A2E))),
        ],
      ),
    );
  }

  Widget _buildDriverForm() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)]),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Driver Information", style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
          const SizedBox(height: 20),
          _buildField("Full Name *", _nameController, "John Smith"),
          _buildField("Email Address *", _emailController, "john@example.com", keyboardType: TextInputType.emailAddress),
          _buildField("Phone Number *", _phoneController, "+1 555 000 0000", keyboardType: TextInputType.phone),
          _buildField("Flight Number (optional)", _flightController, "BA 256"),
        ],
      ),
    );
  }

  Widget _buildPaymentForm() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)]),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text("Payment Details", style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E))),
          const SizedBox(height: 20),
          _buildField("Card Number *", _cardController, "1234 5678 9012 3456", keyboardType: TextInputType.number),
          Row(
            children: [
              Expanded(child: _buildField("Expiry Date *", _expiryController, "MM/YY", keyboardType: TextInputType.datetime)),
              const SizedBox(width: 16),
              Expanded(child: _buildField("CVV *", _cvvController, "123", keyboardType: TextInputType.number, obscure: true)),
            ],
          ),
          _buildField("Name on Card *", _cardNameController, "John Smith"),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: const Color(0xFFF0FDF4), borderRadius: BorderRadius.circular(12)),
            child: Row(
              children: [
                const Icon(Icons.lock_outline, size: 14, color: Color(0xFF15803D)),
                const SizedBox(width: 8),
                Expanded(child: Text("Your payment is secured with 256-bit SSL encryption", style: GoogleFonts.inter(fontSize: 12, color: const Color(0xFF15803D)))),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildField(String label, TextEditingController controller, String placeholder, {TextInputType keyboardType = TextInputType.text, bool obscure = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w500, color: const Color(0xFF6B7280))),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          obscureText: obscure,
          decoration: InputDecoration(
            hintText: placeholder,
            hintStyle: GoogleFonts.inter(color: const Color(0xFF9CA3AF)),
            filled: true,
            fillColor: const Color(0xFFF9FAFB),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFE5E7EB))),
            focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFF123C69))),
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
          ),
          validator: (v) => (v == null || v.isEmpty) && label.contains('*') ? "Required" : null,
        ),
        const SizedBox(height: 16),
      ],
    );
  }
}
