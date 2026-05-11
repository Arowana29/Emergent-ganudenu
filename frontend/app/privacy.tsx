import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '../components/Icon';

const DEEP_PURPLE = '#4C1D95';
const ACCENT = '#F59E0B';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity testID="back-btn" onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitleSi}>පෞද්ගලිකත්ව ප්‍රතිපත්තිය</Text>
          <Text style={styles.headerTitleEn}>Privacy Policy</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Last Updated */}
        <View style={styles.metaBox}>
          <Text style={styles.metaSi}>අවසන් යාවත්කාලීන කිරීම: 2026 මැයි</Text>
          <Text style={styles.metaEn}>Last Updated: May 2026</Text>
        </View>

        {/* Intro */}
        <Section
          siTitle="හැඳින්වීම"
          enTitle="Introduction"
          siBody="Ganu Denu (ගණු දෙනු) යනු Sri Lankan පරිශීලකයන් සඳහා නිර්මාණය කරන ලද මුදල් කළමනාකරණ අයදුම්පතකි. ඔබගේ පෞද්ගලිකත්වය අපට වැදගත් ය."
          enBody="Ganu Denu is a money manager app designed for Sri Lankan users. We value your privacy and are committed to protecting your personal data."
        />

        <Section
          siTitle="අපි එකතු කරන දත්ත"
          enTitle="Data We Collect"
          siBody="• ඔබ ඇතුළත් කරන ගනුදෙනු දත්ත (මුදල, වර්ගය, විස්තරය, දිනය)
• ඔබ අනුමත කරන්නේ නම් පමණක් SMS දත්ත (Bank transaction detection සඳහා)
• Device-ID (analytics සඳහා, anonymized)
• ඔබ දෙන app settings (PIN, language preference)"
          enBody="• Transaction data you enter (amount, category, description, date)
• SMS data ONLY if you grant permission (for bank transaction detection)
• Device-ID (anonymized analytics)
• App settings you choose (PIN, language preference)"
        />

        <Section
          siTitle="අපි දත්ත භාවිතා කරන ආකාරය"
          enTitle="How We Use Data"
          siBody="• ඔබට ඔබේ වියදම් track කිරීමට හැකි වන්නේ
• Reports/charts ජනනය කිරීමට
• SMS-detected transactions යෝජනා කිරීමට
• App එක වඩා හොඳින් කරගැනීමට (analytics)"
          enBody="• To enable you to track your expenses
• To generate reports/charts
• To suggest SMS-detected transactions
• To improve the app (analytics)"
        />

        <Section
          siTitle="දත්ත ගබඩාව"
          enTitle="Data Storage"
          siBody="ඔබේ ගනුදෙනු දත්ත ආරක්ෂිත server එකක (encrypted) ගබඩා වේ. ඔබ Google Drive backup සක්‍රීය කළහොත් මාත්‍රයි දත්ත cloud එකේ සුරැකේ. ඔබට ඕනෑම වේලාවක දත්ත මකා දැමීමට හැකිය."
          enBody="Your transaction data is stored on a secure (encrypted) server. Data is saved to cloud only if you enable Google Drive backup. You can delete your data at any time."
        />

        <Section
          siTitle="තෙවන පාර්ශවයන් සමඟ බෙදාහැරීම"
          enTitle="Third-Party Sharing"
          siBody="අපි ඔබේ පෞද්ගලික දත්ත කිසිදු තෙවන පාර්ශවයකට **විකුණන්නේ නැත**. SMS දත්ත ඔබේ phone එක තුළ පමණක් process වේ — server එකට යවන්නේ නැත."
          enBody="We do NOT sell your personal data to any third party. SMS data is processed only on your phone — never sent to our server."
        />

        <Section
          siTitle="SMS අවසරයන්"
          enTitle="SMS Permissions"
          siBody="ඔයාගේ permission දුන්නොත් පමණයි අපි SMS කියවන්නේ. Bank/Wallet messages (Sampath, BOC, eZ Cash, Dialog Pay, etc.) auto-detect කරගන්න. ඔබට ඕනෑම වේලාවක මේ permission ඉවත් කරගත හැකිය."
          enBody="We only read SMS if you grant permission. Used to auto-detect Bank/Wallet messages (Sampath, BOC, eZ Cash, Dialog Pay, etc.). You can revoke this permission at any time."
        />

        <Section
          siTitle="ඔබේ අයිතිවාසිකම්"
          enTitle="Your Rights"
          siBody="• ඔබේ දත්ත access කරගන්න
• ඕනෑම දත්තයක් මකාදමන්න
• Account එක delete කරගන්න
• Backup එක disable කරගන්න
• Privacy concerns පහත email එකට යවන්න"
          enBody="• Access your data
• Delete any data
• Delete your account
• Disable backup
• Send privacy concerns to the email below"
        />

        <Section
          siTitle="ළමයින්"
          enTitle="Children"
          siBody="මෙම app එක වයස අවුරුදු 13ට අඩු ළමයින් සඳහා නොවේ. අපි දැනුවත්ව ළමයින්ගේ දත්ත එකතු නොකරමු."
          enBody="This app is not intended for children under 13. We do not knowingly collect data from children."
        />

        <Section
          siTitle="වෙනස්කම්"
          enTitle="Changes to Policy"
          siBody="මෙම ප්‍රතිපත්තිය යාවත්කාලීන කළ විට ඔබට app එක තුළ දන්වමු."
          enBody="We will notify you in-app whenever this policy is updated."
        />

        {/* Contact */}
        <View style={styles.contactBox}>
          <Text style={styles.contactTitleSi}>අප හා සම්බන්ධ වන්න</Text>
          <Text style={styles.contactTitleEn}>Contact Us</Text>
          <Text style={styles.contactBody}>
            පෞද්ගලිකත්වය පිළිබඳ ඕනෑම ප්‍රශ්නයක් තිබේ නම් අපට email එකක් යවන්න:
            {'\n'}For any privacy-related questions, email us:
          </Text>

          <TouchableOpacity
            testID="email-1"
            style={styles.emailBtn}
            onPress={() => Linking.openURL('mailto:sismathtrading@kamfa.net')}
          >
            <Ionicons name="mail" size={18} color={DEEP_PURPLE} />
            <Text style={styles.emailText}>sismathtrading@kamfa.net</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="email-2"
            style={styles.emailBtn}
            onPress={() => Linking.openURL('mailto:silshabir@gmail.com')}
          >
            <Ionicons name="mail" size={18} color={DEEP_PURPLE} />
            <Text style={styles.emailText}>silshabir@gmail.com</Text>
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <View style={styles.footer}>
          <Text style={styles.copyrightSi}>© 2026 Ganu Denu · සියලුම අයිතිවාසිකම් ඇවිරිණි</Text>
          <Text style={styles.copyrightEn}>© 2026 Ganu Denu · All Rights Reserved</Text>
          <Text style={styles.madeIn}>🇱🇰 Made for Sri Lanka with ❤️</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const Section: React.FC<{ siTitle: string; enTitle: string; siBody: string; enBody: string }> = ({
  siTitle, enTitle, siBody, enBody,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitleSi}>{siTitle}</Text>
    <Text style={styles.sectionTitleEn}>{enTitle}</Text>
    <Text style={styles.sectionBodySi}>{siBody}</Text>
    <Text style={styles.sectionBodyEn}>{enBody}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7FA' },
  header: {
    backgroundColor: DEEP_PURPLE,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTextWrap: { flex: 1, alignItems: 'center' },
  headerTitleSi: { fontSize: 18, fontWeight: '900', color: '#FFFFFF' },
  headerTitleEn: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },

  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  metaBox: {
    backgroundColor: '#EDE9FE', borderRadius: 12,
    padding: 12, marginBottom: 18,
    borderLeftWidth: 4, borderLeftColor: DEEP_PURPLE,
  },
  metaSi: { fontSize: 14, fontWeight: '800', color: DEEP_PURPLE },
  metaEn: { fontSize: 11, color: '#6B7280', marginTop: 2 },

  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitleSi: { fontSize: 17, fontWeight: '900', color: '#1F2937', marginBottom: 2 },
  sectionTitleEn: { fontSize: 12, fontWeight: '600', color: '#9CA3AF', marginBottom: 10 },
  sectionBodySi: { fontSize: 14, color: '#374151', lineHeight: 22, fontWeight: '500', marginBottom: 8 },
  sectionBodyEn: { fontSize: 12, color: '#6B7280', lineHeight: 18 },

  contactBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 18,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: ACCENT,
  },
  contactTitleSi: { fontSize: 18, fontWeight: '900', color: '#92400E' },
  contactTitleEn: { fontSize: 12, fontWeight: '600', color: '#B45309', marginBottom: 12 },
  contactBody: { fontSize: 13, color: '#78350F', marginBottom: 14, lineHeight: 19 },

  emailBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10, padding: 12,
    marginBottom: 8,
    borderWidth: 1, borderColor: '#FCD34D',
  },
  emailText: { fontSize: 14, fontWeight: '600', color: DEEP_PURPLE, flex: 1 },

  footer: { alignItems: 'center', marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  copyrightSi: { fontSize: 12, fontWeight: '700', color: '#6B7280', textAlign: 'center' },
  copyrightEn: { fontSize: 10, color: '#9CA3AF', textAlign: 'center', marginTop: 2 },
  madeIn: { fontSize: 12, color: '#9CA3AF', marginTop: 10 },
});
