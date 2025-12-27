$part1 = Get-Content "d:\GIT\Project-Capstone-Desa\temp_create_part1.txt" -Raw
$newFunction = @"

    const generateTemplateContent = (type) => {
        // Get current user data from Inertia page props
        const user = usePage().props.auth.user;
        
        // Use the helper function from letterTemplates.js
        return generateLetterTemplate(type, user);
    };
"@
$part2 = Get-Content "d:\GIT\Project-Capstone-Desa\temp_create_part2.txt" -Raw

$combined = $part1 + $newFunction + $part2

Set-Content "d:\GIT\Project-Capstone-Desa\resources\js\Pages\Letters\Create.jsx" -Value $combined -Encoding UTF8

Write-Host "✅ Create.jsx berhasil diupdate!"
Write-Host "✅ Semua template (termasuk Surat Cuti dan Memo) sekarang aktif!"
Write-Host "🔄 Silakan refresh browser untuk melihat perubahan."
