import tkinter as tk
from tkinter import filedialog, messagebox
import os
import shutil

# دالة لاختيار مجلد لحفظ الملف
def choose_save_folder():
    folder_selected = filedialog.askdirectory(title="اختر المجلد لحفظ الملف")
    return folder_selected

# دالة فك التشفير
def decrypt_file():
    file_path = file_path_entry.get()
    if not file_path:
        messagebox.showerror("خطأ", "من فضلك اختر ملفًا للتشفير")
        return

    try:
        # تحديد مكان الحفظ
        save_folder = choose_save_folder()
        if not save_folder:
            messagebox.showerror("خطأ", "من فضلك اختر مجلد لحفظ الملف")
            return

        # منطق فك التشفير: هنا يتم استبدال هذا الجزء بما يناسب فك التشفير الفعلي
        decrypted_file_path = os.path.join(save_folder, "decrypted_file.txt")
        
        # هذه فقط محاكاة لفك التشفير: نسخ الملف إلى مكان آخر
        shutil.copy(file_path, decrypted_file_path)

        # إشعار بالنجاح
        messagebox.showinfo("نجاح", f"تم فك تشفير الملف وحفظه في: {decrypted_file_path}")
    except Exception as e:
        messagebox.showerror("خطأ", f"حدث خطأ أثناء فك التشفير: {str(e)}")

# دالة لاختيار الملف
def browse_file():
    filename = filedialog.askopenfilename(filetypes=[("Encrypted Files", "*.enc")])
    file_path_entry.delete(0, tk.END)
    file_path_entry.insert(0, filename)

# إعداد واجهة المستخدم
window = tk.Tk()
window.title("أداة فك تشفير ملفات بايثون")
window.geometry("450x400")
window.config(bg="#2b2b2b")  # خلفية داكنة

# العنوان
title_label = tk.Label(window, text="أداة فك تشفير الملفات", font=("Helvetica", 16), bg="#2b2b2b", fg="#ffffff")
title_label.pack(pady=20)

# إدخال المسار
file_path_label = tk.Label(window, text="مسار الملف المشفر:", font=("Helvetica", 12), bg="#2b2b2b", fg="#ffffff")
file_path_label.pack(pady=5)

file_path_entry = tk.Entry(window, font=("Helvetica", 12), width=40)
file_path_entry.pack(pady=5)

# زر اختيار الملف
browse_button = tk.Button(window, text="اختيار ملف", font=("Helvetica", 12), command=browse_file)
browse_button.pack(pady=10)

# زر فك التشفير
decrypt_button = tk.Button(window, text="فك التشفير", font=("Helvetica", 12), bg="#4CAF50", fg="white", command=decrypt_file)
decrypt_button.pack(pady=20)

# إضافة حقوق المستخدم
footer_label = tk.Label(window, text="𝑫𝑨𝑹𝑲 𝑯𝑨𝑪𝑲𝑬𝑹", font=("Helvetica", 10), bg="#2b2b2b", fg="#ffffff")
footer_label.pack(side=tk.BOTTOM, pady=10)

# تشغيل التطبيق
window.mainloop()
