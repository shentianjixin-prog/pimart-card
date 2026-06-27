import re
import urllib.request

url = "https://www.pokemon.cn/tcg/product/15453.html"
html = urllib.request.urlopen(url, timeout=30).read().decode("utf-8", "replace")
patterns = [
    r"https://image\.pokemon\.com\.cn[^\"'\s<>]+",
    r"https://www\.pokemon\.cn/wp-content/uploads/[^\"'\s<>]+",
]
seen = set()
for pat in patterns:
    for m in re.findall(pat, html):
        seen.add(m.split("?")[0])
for u in sorted(seen):
    print(u)
