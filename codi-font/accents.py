# Accent per pàgina (clar / fosc) i comprovació de contrast WCAG
ACC={
 "index":   dict(l=dict(accent="#2f5d46",soft="#e0ebe2",ink="#ffffff",bar="#6f8f5e",a2="#7a5410"), d=dict(accent="#8cc4a1",soft="#20332a",ink="#0f1a13",bar="#8fb27c",a2="#e0b45c")),
 "vermut":  dict(l=dict(accent="#7f5307",soft="#f3e6c8",ink="#ffffff",bar="#6f8f5e",a2="#7f5307"), d=dict(accent="#e6ad48",soft="#3a2f17",ink="#1a1408",bar="#8fb27c",a2="#e6ad48")),
 "ensaimades":dict(l=dict(accent="#8a4a10",soft="#f4e3cf",ink="#ffffff",bar="#c4964e",a2="#8a4a10"), d=dict(accent="#e9a862",soft="#3a2a18",ink="#1a1206",bar="#d8ad66",a2="#e9a862")),
 "manitoba":dict(l=dict(accent="#265480",soft="#dbe6f0",ink="#ffffff",bar="#b0711d",a2="#8a5512"), d=dict(accent="#8ebce6",soft="#1d2f40",ink="#0c1620",bar="#e3a750",a2="#e8ad5a")),
 "pa":      dict(l=dict(accent="#844515",soft="#f1e0cd",ink="#ffffff",bar="#b08a3c",a2="#844515"), d=dict(accent="#e5a066",soft="#3a2818",ink="#1b1209",bar="#d2ad5e",a2="#e5a066")),
 "brioix":  dict(l=dict(accent="#845008",soft="#f6e7c8",ink="#ffffff",bar="#d9a521",a2="#845008"), d=dict(accent="#f0b443",soft="#3b2c12",ink="#1c1405",bar="#e8c25a",a2="#f0b443")),
 "iogurt":  dict(l=dict(accent="#58409a",soft="#e7e0f6",ink="#ffffff",bar="#c9a400",a2="#58409a"), d=dict(accent="#b9a3f2",soft="#2e2545",ink="#16112a",bar="#e5c840",a2="#b9a3f2")),
 "embotits":dict(l=dict(accent="#8c1c2b",soft="#f4dadd",ink="#ffffff",bar="#c27d7d",a2="#8c1c2b"), d=dict(accent="#f08a98",soft="#3d1c22",ink="#22090d",bar="#d79a9a",a2="#f08a98")),
 "arros":   dict(l=dict(accent="#994708",soft="#f5e0cc",ink="#ffffff",bar="#d6961e",a2="#994708"), d=dict(accent="#f0904a",soft="#3c2614",ink="#1f1006",bar="#e8b04a",a2="#f0904a")),
}
NEU={"l":dict(bg="#eceeea",surface="#f9faf7",sunk="#f1f3ee",ink="#1c201d",muted="#4f5751",field="#7d857f",bad="#a8251b",badsoft="#f7dfdb",warn="#7a4f00",warnsoft="#f6ead2",info="#245a7a",infosoft="#dde9f0"),
     "d":dict(bg="#141715",surface="#1c201d",sunk="#181b19",ink="#e7ebe6",muted="#aab2ab",field="#7a837c",bad="#f39a90",badsoft="#3d201d",warn="#f2bd60",warnsoft="#3a2d15",info="#8fc0dc",infosoft="#17303d")}
def lum(h):
    h=h.lstrip("#");r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c:c/12.92 if c<=.03928 else ((c+.055)/1.055)**2.4
    return .2126*f(r)+.7152*f(g)+.0722*f(b)
def cr(a,b):
    la,lb=lum(a),lum(b);return (max(la,lb)+.05)/(min(la,lb)+.05)
def css(k):
    a=ACC[k]
    blk=lambda t:f'--accent:{t["accent"]}; --accent-soft:{t["soft"]}; --accent-ink:{t["ink"]}; --bar:{t["bar"]}; --accent2:{t["a2"]};'
    return (f':root{{ {blk(a["l"])} }}\n@media (prefers-color-scheme: dark){{:root:not([data-theme="light"]){{ {blk(a["d"])} }}}}\n:root[data-theme="dark"]{{ {blk(a["d"])} }}\n')
if __name__=="__main__":
    bad=0
    for m in "ld":
        N=NEU[m]
        for x,y,need,lab in [("muted","bg",4.5,"muted/bg"),("muted","surface",4.5,"muted/surface"),("muted","sunk",4.5,"muted/sunk"),("ink","bg",7,"ink/bg"),("field","surface",3,"field/surface"),
                             ("surface","bad",4.5,"tag bad"),("surface","warn",4.5,"tag warn"),("surface","info",4.5,"tag info"),("ink","badsoft",4.5,"ink/badsoft"),("muted","warnsoft",4.5,"muted/warnsoft")]:
            r=cr(N[x],N[y]);ok=r>=need;bad+=not ok;print(m,lab,round(r,2),"OK" if ok else "FAIL")
        for k,a in ACC.items():
            t=a[m];tests=[(t["accent"],N["surface"],4.5,"accent/surface"),(t["accent"],N["bg"],4.5,"accent/bg"),(t["accent"],t["soft"],4.5,"accent/soft"),(t["ink"],t["accent"],4.5,"ink/accent"),(N["ink"],t["soft"],4.5,"ink/soft"),(t["a2"],N["surface"],4.5,"a2/surface"),(t["bar"],N["sunk"],2.0,"bar/sunk")]
            for f,b,need,lab in tests:
                r=cr(f,b)
                if r<need: bad+=1;print(m,k,lab,round(r,2),"FAIL")
    print("fails:",bad)
