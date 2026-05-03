// Per-article body strings. Plain HTML (sanitised at author time, never user
// input) so we can use {@html} inside the methodology Prose wrapper without
// authoring 13 separate .svelte files. Article structure: each starts with a
// summary <p>, has H2/H3 headings, lists, internal links, and ends with a
// short "Further reading" section.

export const BODIES: Record<string, string> = {
  // ─── Schools of thought ─────────────────────────────────────────────

  "madhhab/general": `<p>The <strong>General</strong> ruleset in FairShare follows the rulings the four Sunni schools (Hanafi, Maliki, Shafi'i, Hanbali) agree on. Where they diverge in well-known cases, it follows the majority position. It's the right starting point for anyone who isn't deliberately following one school over the others.</p>

    <h2>What it covers</h2>
    <p>Every fixed-share heir is assigned the same fraction across all four schools. That's the bedrock 80% of Fara'id. The General view aligns with the schools on:</p>
    <ul>
      <li>The six prescribed fractions (1/2, 1/4, 1/8, 2/3, 1/3, 1/6) and which heirs receive them.</li>
      <li>The blocking (Hajb) chain: son blocks son's son, father blocks paternal grandfather, etc.</li>
      <li>The Awl proportional reduction when shares overflow.</li>
      <li>The Radd surplus redistribution when shares fall short and no residuary is present.</li>
    </ul>

    <h2>Where it differs from individual schools</h2>
    <p>On the three named contested cases (<a href="/methodology/special-cases/umariatan">Umariatan</a>, <a href="/methodology/special-cases/musharakah">Musharakah</a>, <a href="/methodology/special-cases/grandfather-with-siblings">Grandfather-with-siblings</a>), General sides with the majority of three schools against any single dissenter. In practice that means agreeing with Maliki, Shafi'i, and Hanbali on the grandfather case; with Maliki and Shafi'i on Musharakah; and with Umar's ruling (which all four classical schools eventually adopted) on Umariatan.</p>

    <h2>When you should pick a specific school instead</h2>
    <p>If you or your family follow one school as a matter of religious commitment, and especially if you're consulting a mufti from that school, choose it explicitly in the calculator. The differences are small in most cases but real when they trigger.</p>

    <h2>Further reading</h2>
    <ul>
      <li><a href="/methodology/rules/fixed-shares">The six fixed shares</a></li>
      <li><a href="/methodology/rules/blocking">Blocking (Hajb)</a></li>
    </ul>`,

  "madhhab/hanafi": `<p>The <strong>Hanafi school</strong> is the largest by following. Historically the school of the Ottoman empire, today it's dominant across South Asia, Central Asia, Turkey, and the Levant. Its inheritance rulings agree with the other three schools on most cases but have a few sharp differences worth knowing.</p>

    <h2>Distinctive Hanafi positions</h2>
    <h3>Grandfather blocks siblings</h3>
    <p>In the Hanafi school, a paternal grandfather <strong>completely blocks</strong> the deceased's siblings (full and paternal half) when the father is dead. The other three Sunni schools have him <em>share</em> with the siblings via the special <a href="/methodology/special-cases/grandfather-with-siblings">grandfather-with-siblings</a> calculation.</p>

    <h3>No Musharakah</h3>
    <p>In the <a href="/methodology/special-cases/musharakah">Musharakah case</a> (husband + mother + 2+ maternal half-siblings + full siblings), Hanafi gives the full siblings <em>nothing</em>. They're residuary heirs, and the estate is already exhausted by the fixed shares. Maliki and Shafi'i, by contrast, let them join the maternal half-siblings in the 1/3 share.</p>

    <h3>Father blocks maternal grandmother</h3>
    <p>Only in the Hanafi school does the deceased's father block the maternal grandmother. Other schools allow her to inherit her 1/6 even when the father is alive.</p>

    <h2>What it shares with the others</h2>
    <p>Everything else: the six fixed fractions, blocking by closer descendants, Awl, Radd (Hanafi applies it readily, even more so than Maliki), and Umariatan.</p>

    <h2>Further reading</h2>
    <ul>
      <li><a href="/methodology/special-cases/grandfather-with-siblings">Grandfather with siblings</a></li>
      <li><a href="/methodology/special-cases/musharakah">Musharakah</a></li>
      <li><a href="/methodology/madhhab/general">The General opinion (compare)</a></li>
    </ul>`,

  "madhhab/maliki": `<p>The <strong>Maliki school</strong> is dominant across North Africa and West Africa, with deep roots in the practice of the people of Madinah. Its inheritance rulings broadly track the General/majority opinion, with a couple of historical wrinkles around Radd.</p>

    <h2>Distinctive Maliki positions</h2>
    <h3>Historical reluctance to apply Radd</h3>
    <p>Classical Maliki authorities preferred that surplus inheritance (when fixed shares total less than the estate and there's no residuary) go to the public treasury (<em>Bayt al-Mal</em>) rather than be redistributed among the fixed-share heirs. In modern practice, where the treasury isn't organised to receive estates, Maliki scholars apply <a href="/methodology/rules/radd">Radd</a> the same way the other schools do. FairShare follows the contemporary practice.</p>

    <h3>Joins Shafi'i on Musharakah and Grandfather</h3>
    <p>Maliki sides with Shafi'i and Hanbali (against Hanafi) on the <a href="/methodology/special-cases/musharakah">Musharakah</a> case, where full siblings join maternal half-siblings in their 1/3 share. Same alignment on the <a href="/methodology/special-cases/grandfather-with-siblings">grandfather-with-siblings</a> case: the grandfather shares with the siblings rather than blocking them.</p>

    <h2>What it shares with the others</h2>
    <p>The six fixed fractions, the blocking chain, Awl, and Umariatan. Maliki agrees with the majority on all of these.</p>

    <h2>Further reading</h2>
    <ul>
      <li><a href="/methodology/rules/radd">Radd (the surplus rule)</a></li>
      <li><a href="/methodology/madhhab/shafii">Shafi'i (closely aligned)</a></li>
    </ul>`,

  "madhhab/shafii": `<p>The <strong>Shafi'i school</strong> dominates Egypt, the Levant, and Southeast Asia (Indonesia, Malaysia). Its inheritance rulings closely mirror Maliki and Hanbali, and stand against Hanafi on the contested special cases.</p>

    <h2>Distinctive Shafi'i positions</h2>
    <h3>Applies Musharakah</h3>
    <p>Where Hanafi gives full siblings nothing in the <a href="/methodology/special-cases/musharakah">Musharakah</a> case, Shafi'i has them <em>share</em> with the maternal half-siblings in the 1/3 portion, even though they would otherwise be residuary heirs with no remainder to claim. The reasoning: they share the same mother, so it's just to include them.</p>

    <h3>Grandfather as a sibling on the case</h3>
    <p>On the <a href="/methodology/special-cases/grandfather-with-siblings">grandfather-with-siblings</a> case, Shafi'i computes three options for the grandfather (1/3 of remainder, share-as-sibling, 1/6 minimum) and gives him the largest. The same algorithm is used by Maliki and Hanbali, with minor sub-rule differences.</p>

    <h3>Applies Radd</h3>
    <p>Shafi'i has historically been more accepting of Radd than Maliki, and applies it readily in modern practice.</p>

    <h2>Further reading</h2>
    <ul>
      <li><a href="/methodology/special-cases/musharakah">Musharakah</a></li>
      <li><a href="/methodology/special-cases/grandfather-with-siblings">Grandfather with siblings</a></li>
      <li><a href="/methodology/madhhab/maliki">Maliki (closely aligned)</a></li>
    </ul>`,

  "madhhab/hanbali": `<p>The <strong>Hanbali school</strong> is the official school of Saudi Arabia and dominant across the Arabian peninsula. Its inheritance rulings align almost entirely with Shafi'i and Maliki against the Hanafi position on contested cases.</p>

    <h2>Distinctive Hanbali positions</h2>
    <p>Hanbali agrees with Maliki and Shafi'i on:</p>
    <ul>
      <li>Allowing full siblings into the <a href="/methodology/special-cases/musharakah">Musharakah</a> share with maternal half-siblings.</li>
      <li>Letting the <a href="/methodology/special-cases/grandfather-with-siblings">grandfather share with siblings</a> rather than blocking them.</li>
      <li>Applying <a href="/methodology/rules/radd">Radd</a> when the estate has no residuary heir.</li>
    </ul>
    <p>Where Hanbali sometimes diverges from the other two is in technical sub-rules within the grandfather case (the exact 1/3 / sibling-share / 1/6 selection), but the practical outcomes are usually the same.</p>

    <h2>What it shares with the others</h2>
    <p>The six fixed fractions, blocking, Awl, and Umariatan are all standard.</p>

    <h2>Further reading</h2>
    <ul>
      <li><a href="/methodology/madhhab/shafii">Shafi'i (closely aligned)</a></li>
      <li><a href="/methodology/special-cases/grandfather-with-siblings">Grandfather with siblings</a></li>
    </ul>`,

  // ─── Core rules ─────────────────────────────────────────────────────

  "rules/fixed-shares": `<p>Fixed shares (<em>al-furud</em>, the singular is <em>fardh</em>) are the prescribed Quranic fractions assigned to specific heirs. They're the floor of the inheritance system: every other rule (residuary, blocking, Awl, Radd) operates on top of them.</p>

    <h2>The six fractions</h2>
    <p>Every fixed-share heir receives one of exactly six fractions, all stated directly in the Quran:</p>
    <ul>
      <li><strong>1/2</strong>, <strong>1/4</strong>, <strong>1/8</strong></li>
      <li><strong>2/3</strong>, <strong>1/3</strong>, <strong>1/6</strong></li>
    </ul>
    <p>The shares appear primarily in three verses of Surah An-Nisa: <em>4:11, 4:12, and 4:176</em>.</p>

    <h2>Who receives what</h2>
    <h3>Spouse</h3>
    <ul>
      <li>Husband: <strong>1/2</strong> if no descendants, <strong>1/4</strong> if descendants exist (4:12).</li>
      <li>Wife (or wives, sharing): <strong>1/4</strong> if no descendants, <strong>1/8</strong> if descendants exist (4:12).</li>
    </ul>

    <h3>Parents</h3>
    <ul>
      <li>Mother: <strong>1/3</strong> normally, reduced to <strong>1/6</strong> if descendants exist or there are 2+ siblings (4:11).</li>
      <li>Father: <strong>1/6</strong> when descendants exist; otherwise purely residuary (no fixed share, takes the remainder).</li>
    </ul>

    <h3>Daughters</h3>
    <ul>
      <li>One daughter (no sons): <strong>1/2</strong>.</li>
      <li>Two or more daughters (no sons): together <strong>2/3</strong>.</li>
      <li>With a son present: residuary, sharing 2:1 with brothers.</li>
    </ul>

    <h3>Sisters</h3>
    <p>Same pattern as daughters: one sister gets 1/2, two or more share 2/3, with a brother they're residuary at 2:1.</p>

    <h3>Maternal half-siblings</h3>
    <p>One of either gender: <strong>1/6</strong>. Two or more (regardless of gender mix): together <strong>1/3</strong>, shared equally. Uniquely, male and female maternal half-siblings inherit equal shares.</p>

    <h2>Important context</h2>
    <p>"Fixed" doesn't mean "always paid in full." If the sum of fixed shares exceeds the estate, <a href="/methodology/rules/awl">Awl</a> reduces them proportionally. If it falls short and no residuary claims the remainder, <a href="/methodology/rules/radd">Radd</a> redistributes the surplus. And <a href="/methodology/rules/blocking">blocking (Hajb)</a> can prevent a heir from receiving anything at all.</p>

    <h2>Further reading</h2>
    <ul>
      <li><a href="/methodology/rules/blocking">Blocking (Hajb)</a></li>
      <li><a href="/methodology/rules/residuary">Residuary heirs (Asabah)</a></li>
    </ul>`,

  "rules/blocking": `<p>Blocking (<em>Hajb</em>) is the rule that prevents a more distant heir from inheriting when a closer one is alive. It's the most common reason an heir who looks like they should inherit ends up with nothing.</p>

    <h2>Two types of blocking</h2>
    <p>Classical scholars distinguish two types:</p>
    <ul>
      <li><strong>Hajb hirman</strong> is total blocking. The heir gets nothing. This is what most people mean by "blocking" and what FairShare detects.</li>
      <li><strong>Hajb nuqsan</strong> is reduction. The heir still inherits but at a smaller share. The mother going from 1/3 to 1/6 because of children present is a classic example.</li>
    </ul>

    <h2>The blocking chain</h2>
    <p>The general principle: closer relatives block more distant ones in the same line. Some examples:</p>
    <ul>
      <li><strong>Son</strong> blocks son's son, all siblings, all uncles, and their descendants.</li>
      <li><strong>Father</strong> blocks paternal grandfather, all siblings, and all collaterals (uncles and their sons).</li>
      <li><strong>Full brother</strong> blocks paternal half-brother, all uncles, and their sons.</li>
      <li><strong>Mother</strong> blocks both grandmothers (paternal and maternal).</li>
    </ul>

    <h2>Heirs who are never blocked</h2>
    <p>Six heirs are never totally blocked: <strong>father, mother, husband, wife, son, daughter</strong>. Their share might shrink (the mother going from 1/3 to 1/6) but they always inherit something.</p>

    <h2>School-specific blocking</h2>
    <p>The Hanafi school adds a few cases the others don't:</p>
    <ul>
      <li>Father blocks the <em>maternal</em> grandmother (only Hanafi; others let her inherit).</li>
      <li>Paternal grandfather blocks all siblings (only Hanafi; others have him share via the <a href="/methodology/special-cases/grandfather-with-siblings">grandfather-with-siblings</a> rule).</li>
    </ul>

    <h2>Further reading</h2>
    <ul>
      <li><a href="/methodology/rules/fixed-shares">Fixed shares</a></li>
      <li><a href="/methodology/rules/residuary">Residuary heirs</a></li>
    </ul>`,

  "rules/residuary": `<p>Residuary heirs (<em>asabah</em>) take whatever's left of the estate after fixed-share heirs have been paid. They have no prescribed fraction; their share is whatever the remainder happens to be.</p>

    <h2>Three sub-types</h2>
    <h3>Asabah bin-nafs (by self)</h3>
    <p>Male relatives in a defined priority order. Each one, if present, takes the entire residue and excludes those below him on the list:</p>
    <ol>
      <li>Son</li>
      <li>Son's son (then son's son's son…)</li>
      <li>Father</li>
      <li>Paternal grandfather (then his father…)</li>
      <li>Full brother</li>
      <li>Paternal half-brother</li>
      <li>Full brother's son (then his son…)</li>
      <li>Paternal half-brother's son (then his son…)</li>
      <li>Full paternal uncle</li>
      <li>Paternal half-uncle</li>
      <li>Full paternal uncle's son</li>
      <li>Paternal half-uncle's son</li>
    </ol>

    <h3>Asabah bil-ghayr (by another)</h3>
    <p>Female relatives who become residuary because a male counterpart at the same level is present. They inherit at a 2:1 ratio with the male: male gets two parts, female gets one. This converts daughters, son's daughters, full sisters, and paternal half-sisters from fixed-share heirs into residuaries.</p>

    <h3>Asabah ma'a-l-ghayr (with another)</h3>
    <p>Full sisters and paternal half-sisters become residuary <em>through the presence of female descendants</em> (daughters or son's daughters). Without a male counterpart, the sister still becomes residuary because the daughter takes her fixed share first.</p>

    <h2>Why the order matters</h2>
    <p>Only one residuary "tier" inherits: the closest one present. A son excludes a son's son; a father excludes the grandfather; a full brother excludes a paternal half-brother. The whole residue goes to whichever male relative is highest on the list.</p>

    <h2>The father exception</h2>
    <p>The father is unusual: when descendants exist, he gets a fixed 1/6 <em>and</em> any remaining residue (which is rarely much). Without descendants, he's purely residuary. The grandfather follows the same pattern when no father is present.</p>

    <h2>Further reading</h2>
    <ul>
      <li><a href="/methodology/rules/fixed-shares">Fixed shares</a></li>
      <li><a href="/methodology/rules/awl">Awl (when residue is negative)</a></li>
      <li><a href="/methodology/rules/radd">Radd (when no residuary claims it)</a></li>
    </ul>`,

  "rules/awl": `<p><strong>Awl</strong> is the rule that handles cases where prescribed fixed shares add up to <em>more</em> than the entire estate. Every share is scaled down proportionally so the math works out.</p>

    <h2>The classic example</h2>
    <p>A woman dies leaving a husband, two full sisters, and her mother. Quranic prescriptions:</p>
    <ul>
      <li>Husband (no children): <strong>1/2</strong></li>
      <li>Two or more full sisters: <strong>2/3</strong></li>
      <li>Mother (multiple siblings present): <strong>1/6</strong></li>
    </ul>
    <p>Add them: 1/2 + 2/3 + 1/6 = 3/6 + 4/6 + 1/6 = <strong>8/6</strong>. The total is more than the whole estate.</p>

    <h2>Caliph Umar's ruling</h2>
    <p>When Umar ibn al-Khattab encountered a case like this, he consulted the leading companions of the Prophet. The ruling: keep each share in the same <em>proportion</em> to the others, but scale them down to fit. Practically, raise the denominator from 6 to 8 (the actual total of numerators) and keep the numerators the same:</p>
    <ul>
      <li>Husband: <strong>3/8</strong> (was 3/6)</li>
      <li>Two full sisters: <strong>4/8 = 1/2</strong> (was 4/6)</li>
      <li>Mother: <strong>1/8</strong> (was 1/6)</li>
    </ul>
    <p>The numerators sum to 8, the denominator is 8, and the total is exactly the whole estate. Each heir keeps their proportional standing.</p>

    <h2>The algorithm</h2>
    <ol>
      <li>Find the least common denominator of all prescribed fractions.</li>
      <li>Express each share with that denominator.</li>
      <li>Sum the numerators.</li>
      <li>If the sum exceeds the denominator, replace the denominator with the sum. Numerators stay the same.</li>
    </ol>

    <h2>When Awl triggers</h2>
    <p>Awl tends to appear when a spouse is present alongside multiple female descendants or sisters, especially when parents also have prescribed shares. Pure all-male scenarios rarely trigger it because most male heirs inherit as residuary, absorbing whatever's left rather than competing for fixed fractions.</p>

    <h2>Further reading</h2>
    <ul>
      <li><a href="/methodology/rules/radd">Radd (the inverse of Awl)</a></li>
      <li><a href="/methodology/rules/fixed-shares">Fixed shares</a></li>
    </ul>`,

  "rules/radd": `<p><strong>Radd</strong> (literally "return") is the inverse of Awl. When prescribed fixed shares add up to <em>less</em> than the estate <em>and</em> there's no residuary heir to take the remainder, Radd returns the surplus to the eligible fixed-share heirs in proportion to their original shares.</p>

    <h2>The simplest case</h2>
    <p>A man dies leaving only one daughter. The Quran prescribes her 1/2. There's no son, no father, no brother, no one to take the residue.</p>
    <p>Without Radd, the surplus 1/2 would go to a distant relative or the public treasury. With Radd, the daughter inherits the whole estate.</p>

    <h2>Two conditions</h2>
    <p>Radd triggers only when both hold:</p>
    <ol>
      <li>Total fixed shares are <em>less than</em> the whole estate.</li>
      <li>No residuary heir is present (no son, grandson, full brother, paternal uncle, etc.).</li>
    </ol>

    <h2>The spouse exception</h2>
    <p>Spouses do <strong>not</strong> participate in Radd in the majority opinion. The reasoning: spouses are connected to the deceased only by marriage, not by blood. A husband or wife takes their fixed share but is excluded from the surplus redistribution. The rest of the surplus is split among the blood-related fixed-share heirs.</p>

    <h2>The shortcut formula</h2>
    <p>You don't have to compute the redistribution step by step. Replace the original denominator with the <em>sum of numerators</em>, keeping numerators the same.</p>
    <p>Example: mother (1/6) + daughter (1/2) = mother (1/6) + daughter (3/6). Numerators sum to 4. New denominator: 4. So mother gets 1/4 and daughter gets 3/4. The ratio between them is preserved.</p>

    <h2>Where the schools differ</h2>
    <p>The Hanafi and Hanbali schools apply Radd as the default. Maliki was historically reluctant, preferring the surplus go to the public treasury (Bayt al-Mal); modern Maliki practice generally applies Radd when the treasury isn't organised. Shafi'i sits between the two historically but applies it routinely today.</p>

    <h2>Further reading</h2>
    <ul>
      <li><a href="/methodology/rules/awl">Awl (the inverse)</a></li>
      <li><a href="/methodology/rules/residuary">Residuary heirs (whose absence triggers Radd)</a></li>
    </ul>`,

  // ─── Special cases ──────────────────────────────────────────────────

  "special-cases/umariatan": `<p>The <strong>Umariatan</strong> ("the two cases of Umar") are a pair of named scenarios where Caliph Umar ibn al-Khattab issued a distinctive ruling that all four classical Sunni schools eventually adopted.</p>

    <h2>The condition</h2>
    <p>Both cases require exactly three heirs: a spouse, a mother, and a father. <em>No descendants and no siblings.</em> If any other heir is present, the special rule doesn't apply.</p>

    <h2>Case 1: husband + mother + father</h2>
    <p>Naive fixed-share assignment would give:</p>
    <ul>
      <li>Husband (no children): 1/2</li>
      <li>Mother (no siblings): 1/3</li>
      <li>Father: residuary, gets what's left = 1/6</li>
    </ul>
    <p>The unease here: the father (a male relative) ends up with less than the mother. Umar's ruling: <strong>the mother takes 1/3 of the remainder</strong> (after the husband's 1/2), not 1/3 of the total estate. The result:</p>
    <ul>
      <li>Husband: <strong>1/2</strong></li>
      <li>Mother: <strong>1/3 of 1/2 = 1/6</strong> of the total</li>
      <li>Father: residuary takes the rest = <strong>1/3</strong></li>
    </ul>
    <p>Now the father has more than the mother, preserving the 2:1 male/female pattern that runs through Fara'id.</p>

    <h2>Case 2: wife + mother + father</h2>
    <p>Same logic with the wife's smaller share. Naive assignment:</p>
    <ul>
      <li>Wife (no children): 1/4</li>
      <li>Mother (no siblings): 1/3</li>
      <li>Father: residuary = 5/12</li>
    </ul>
    <p>Umar's ruling: mother gets 1/3 of the remainder (3/4) = 1/4 of the total:</p>
    <ul>
      <li>Wife: <strong>1/4</strong></li>
      <li>Mother: <strong>1/4</strong></li>
      <li>Father: <strong>1/2</strong></li>
    </ul>

    <h2>Why it matters</h2>
    <p>Umariatan is one of the most common "trick" scenarios in inheritance discussions. A naive calculator that doesn't detect it will give the mother 1/3 of the total, a meaningful error in real distributions. FairShare detects both forms automatically.</p>

    <h2>Further reading</h2>
    <ul>
      <li><a href="/methodology/rules/fixed-shares">Why the mother's share usually changes with siblings/descendants</a></li>
      <li><a href="/methodology/special-cases/musharakah">Musharakah (another named case)</a></li>
    </ul>`,

  "special-cases/musharakah": `<p>The <strong>Musharakah</strong> ("the shared case") is a named scenario where the Maliki, Shafi'i, and Hanbali schools allow full siblings to <em>join</em> the maternal half-siblings in their 1/3 share, even though the full siblings would normally be residuary heirs with no remainder to claim. The Hanafi school disagrees and gives the full siblings nothing.</p>

    <h2>The condition</h2>
    <p>All of the following must hold:</p>
    <ul>
      <li>Husband present.</li>
      <li>Mother (or grandmother) present.</li>
      <li>Two or more maternal half-siblings.</li>
      <li>One or more full siblings (brother or sister).</li>
      <li>Total fixed shares already exhaust the estate (so the residue is zero).</li>
    </ul>

    <h2>Walked through</h2>
    <p>Take husband + mother + 2 maternal half-siblings + 1 full brother. Standard fixed shares:</p>
    <ul>
      <li>Husband (no children): <strong>1/2</strong></li>
      <li>Mother (with siblings present): <strong>1/6</strong></li>
      <li>Two maternal half-siblings together: <strong>1/3</strong></li>
    </ul>
    <p>Sum: 1/2 + 1/6 + 1/3 = 1. The estate is exhausted. The full brother, who would normally inherit as residuary, has nothing left to claim.</p>

    <h2>The Maliki / Shafi'i / Hanbali ruling</h2>
    <p>The full brother (and any full siblings present) <em>joins</em> the maternal half-siblings in their 1/3 share, dividing it equally among the four of them, <strong>without</strong> the usual 2:1 male/female split. The reasoning: they share the same mother, so it's just to include them in what's already her line's portion.</p>
    <p>Final shares: husband 1/2, mother 1/6, and the four siblings (2 maternal halves + 1 full brother + ... ) divide the 1/3 equally.</p>

    <h2>The Hanafi position</h2>
    <p>Hanafi treats the full sibling as residuary by definition. With nothing left, they get nothing. The husband, mother, and maternal half-siblings keep their full shares.</p>

    <h2>Further reading</h2>
    <ul>
      <li><a href="/methodology/madhhab/hanafi">Hanafi (the dissenting view)</a></li>
      <li><a href="/methodology/madhhab/shafii">Shafi'i (applies Musharakah)</a></li>
    </ul>`,

  "special-cases/grandfather-with-siblings": `<p>When a deceased leaves no father but does leave a paternal grandfather alongside siblings (full or paternal half), the four Sunni schools split. The <strong>Hanafi school</strong> has the grandfather block the siblings entirely. The other three schools have him <em>share</em> with them in a calculation that gives him whichever option is best.</p>

    <h2>The Hanafi position</h2>
    <p>The grandfather is treated like the father for blocking purposes. He blocks all siblings (full and paternal half) and inherits as residuary. This is the simpler of the two outcomes.</p>

    <h2>The Maliki / Shafi'i / Hanbali position</h2>
    <p>The grandfather <em>shares</em> with the siblings, getting the larger of three options:</p>
    <ol>
      <li><strong>Muqasama</strong>: share with the siblings as if he were one of them, at a 2:1 male:female ratio. The grandfather counts as 2 parts (like a brother).</li>
      <li><strong>One-third of the remainder</strong>, after any other fixed-share heirs are paid.</li>
      <li><strong>One-sixth of the estate</strong>, the minimum guaranteed share.</li>
    </ol>
    <p>Whichever option produces the largest grandfather share is what he takes. The remainder is divided among the siblings at the usual 2:1 ratio.</p>

    <h2>Worked example</h2>
    <p>Deceased leaves: paternal grandfather + 2 full brothers + 1 full sister. No other heirs.</p>
    <ul>
      <li><strong>Hanafi:</strong> grandfather blocks the siblings, takes the entire estate.</li>
      <li><strong>Other schools:</strong> compute three options for the grandfather. Sibling parts = 2 brothers × 2 + 1 sister × 1 = 5; grandfather counts as 2 more, total 7 parts. Option 1 gives him 2/7. Option 2 gives him 1/3. Option 3 gives him 1/6. He takes the largest: <strong>1/3</strong>. The remaining 2/3 splits among siblings at 2:1: each brother gets 4/15, the sister gets 2/15.</li>
    </ul>

    <h2>Why the disagreement</h2>
    <p>The grandfather is a parental figure (like the father, who blocks siblings) but also one generation removed (which puts him on a level with siblings rather than above them). The schools weighed those two intuitions differently.</p>

    <h2>Further reading</h2>
    <ul>
      <li><a href="/methodology/madhhab/hanafi">Hanafi (blocks siblings)</a></li>
      <li><a href="/methodology/madhhab/maliki">Maliki (shares with siblings)</a></li>
      <li><a href="/methodology/rules/blocking">Blocking (Hajb) in general</a></li>
    </ul>`,
};
