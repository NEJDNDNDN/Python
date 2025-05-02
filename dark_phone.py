import phonenumbers
from phonenumbers import geocoder, carrier, timezone
import os

# ألوان
R = "\033[1;31m"  # أحمر
G = "\033[1;32m"  # أخضر
Y = "\033[1;33m"  # أصفر
B = "\033[1;34m"  # أزرق
C = "\033[1;36m"  # سماوي
W = "\033[0m"     # إعادة تعيين اللون

# شعار
os.system("clear")
print(f"""{Y}
╔════════════════════════════════════╗
║       {C}Phone Info Tool v1.0        {Y}║
║       {G}Coded by 𝑫𝑨𝑹𝑲 𝑯𝑨𝑪𝑲𝑬𝑹         {Y}║
╚════════════════════════════════════╝{W}
""")

# إدخال الرقم
number = input(f"{B}[?] Enter phone number (e.g. +201234567890): {W}")

try:
    parsed = phonenumbers.parse(number)

    print(f"\n{G}[+] Valid: {phonenumbers.is_valid_number(parsed)}")
    print(f"{Y}[+] Country: {geocoder.description_for_number(parsed, 'en')}")
    print(f"{Y}[+] Country Code: {parsed.country_code}")
    print(f"{Y}[+] Type: {phonenumbers.number_type(parsed)}")
    print(f"{Y}[+] Carrier: {carrier.name_for_number(parsed, 'en')}")
    print(f"{Y}[+] Timezone: {timezone.time_zones_for_number(parsed)}{W}")

except Exception as e:
    print(f"{R}[-] Error: {e}{W}")
