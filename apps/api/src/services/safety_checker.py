class SafetyChecker:
    def __init__(self):
        # Allergy Class -> List of specific medications
        self.allergy_map = {
            "penicillin": ["amoxicillin", "penicillin g", "ampicillin", "piperacillin"],
            "sulfa drugs": ["sulfamethoxazole", "trimethoprim-sulfamethoxazole", "sulfasalazine"],
            "aspirin": ["aspirin", "acetylsalicylic acid", "bayer"],
            "nsaids": ["ibuprofen", "naproxen", "diclofenac", "celecoxib", "aspirin"],
            "macrolides": ["azithromycin", "clarithromycin", "erythromycin"]
        }

        # Drug-Drug Interactions: (Drug A, Drug B) -> Warning Message
        # The keys are frozensets of lowercased drug names for order-independent lookup
        self.interactions = {
            frozenset(["warfarin", "aspirin"]): "CRITICAL: Increased risk of severe bleeding.",
            frozenset(["warfarin", "ibuprofen"]): "CRITICAL: Increased risk of severe bleeding.",
            frozenset(["warfarin", "naproxen"]): "CRITICAL: Increased risk of severe bleeding.",
            frozenset(["metformin", "insulin"]): "WARNING: Increased risk of hypoglycemia (low blood sugar). Monitor closely.",
            frozenset(["sildenafil", "nitroglycerin"]): "CRITICAL: Risk of severe, potentially fatal hypotension (low blood pressure).",
            frozenset(["lisinopril", "spironolactone"]): "WARNING: Increased risk of hyperkalemia (high potassium).",
            frozenset(["amiodarone", "digoxin"]): "WARNING: Amiodarone can increase Digoxin levels, risking toxicity.",
            frozenset(["clopidogrel", "omeprazole"]): "WARNING: Omeprazole may reduce the antiplatelet effect of Clopidogrel."
        }

    def _normalize(self, text: str):
        return text.strip().lower()

    def check_allergies(self, candidate_meds, patient_allergies):
        """
        Returns (safe_meds, rejected_meds)
        rejected_meds is a list of dicts: {"medication": "Name", "reason": "Reason"}
        """
        safe_meds = []
        rejected_meds = []
        
        normalized_allergies = [self._normalize(a) for a in patient_allergies]

        for med in candidate_meds:
            norm_med = self._normalize(med)
            is_allergic = False
            
            # Check direct match
            if norm_med in normalized_allergies:
                is_allergic = True
                rejected_meds.append({
                    "medication": med,
                    "reason": f"Direct allergy match to {med}"
                })
                continue
                
            # Check class match
            for allergy in normalized_allergies:
                if allergy in self.allergy_map:
                    if norm_med in self.allergy_map[allergy]:
                        is_allergic = True
                        rejected_meds.append({
                            "medication": med,
                            "reason": f"Patient is allergic to {allergy} class, which includes {med}."
                        })
                        break
                        
            if not is_allergic:
                safe_meds.append(med)
                
        return safe_meds, rejected_meds

    def check_interactions(self, candidate_meds, current_meds):
        """
        Checks candidate meds against current meds.
        Returns (safe_meds, warnings, critical_rejections)
        """
        safe_meds = []
        warnings = []
        critical_rejections = []
        
        norm_current_meds = [self._normalize(m) for m in current_meds]
        
        for med in candidate_meds:
            norm_med = self._normalize(med)
            is_rejected = False
            
            for current in norm_current_meds:
                pair = frozenset([norm_med, current])
                if pair in self.interactions:
                    message = self.interactions[pair]
                    if "CRITICAL" in message:
                        is_rejected = True
                        critical_rejections.append({
                            "medication": med,
                            "reason": f"Interaction with {current.title()}: {message}"
                        })
                    else:
                        warnings.append({
                            "medication": med,
                            "warning": f"Interaction with {current.title()}: {message}"
                        })
            
            if not is_rejected:
                safe_meds.append(med)
                
        return safe_meds, warnings, critical_rejections

safety_checker = SafetyChecker()
